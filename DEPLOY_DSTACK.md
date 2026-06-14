# Deploying PitchRotator on dstack

PitchRotator is a Next.js 16 app. For dstack it runs as a single container defined
by `docker-compose.yaml`. dstack runs that compose inside a confidential VM (CVM)
on TDX hardware and gives it a public, TLS-terminated URL.

Key thing to understand up front: **dstack does not build images. It pulls them.**
So the flow is always: build locally → push to a registry → point the compose at
the pushed image → deploy the compose to dstack.

The files that make this work, already in the repo:

- `Dockerfile` — multi-stage build, Next.js `output: "standalone"` (set in `next.config.ts`)
- `.dockerignore`
- `docker-compose.yaml` — runs locally *and* is the app definition dstack deploys

Verified locally: image builds (~277MB), `/` and `/evaluate` both return 200.

---

## 1. Test locally first

```bash
docker compose up --build
# open http://localhost:3000
docker compose down
```

If buildkit hangs on a registry lookup (some networks have no IPv6 route to
docker.io), pull the base once and use the legacy builder:

```bash
docker pull node:24-slim
DOCKER_BUILDKIT=0 COMPOSE_DOCKER_CLI_BUILD=0 docker compose up --build
```

---

## 2. Build and push the image

dstack pulls by reference, so the image must live in a registry the CVM can
reach (Docker Hub / GHCR public, or private with registry credentials).

```bash
# pick your registry namespace
IMG=docker.io/<youruser>/pitchrotator:0.1.0

docker build -t "$IMG" .
docker push "$IMG"

# grab the immutable digest — pin to this, not the tag
docker inspect --format='{{index .RepoDigests 0}}' "$IMG"
# -> docker.io/<youruser>/pitchrotator@sha256:....
```

Then set that digest as the `image:` in `docker-compose.yaml`:

```yaml
services:
  pitchrotator:
    image: docker.io/<youruser>/pitchrotator@sha256:<digest>
    ports:
      - "3000:3000"
    restart: unless-stopped
```

Why the digest: dstack measures the compose file into the CVM's attestation. A
digest makes the deployed image reproducible — a plain `:latest` tag does not,
and undermines the whole point of running in a TEE.

---

## 3a. Deploy via Phala Cloud (managed — easiest)

Phala Cloud is the hosted dstack. No TDX hardware needed on your side.

1. Sign in at https://cloud.phala.network and create an API key.
2. Install the CLI and log in:
   ```bash
   npm install -g phala       # or: npx phala
   phala auth login <api-key>
   ```
3. Deploy the compose:
   ```bash
   phala cvm create --name pitchrotator --compose ./docker-compose.yaml
   ```
   Confirm the exact flags with `phala cvm create --help` (resources are set via
   vcpu / memory / disk flags; this app is tiny — the smallest tier is plenty).

The dashboard (or `phala cvm list`) gives you the App ID and the public URL.
dstack's gateway exposes container ports as TLS subdomains shaped like:

```
https://<app-id>-3000.<gateway-domain>
```

`3000` is the container port from the compose. The attestation quote for the CVM
is viewable from the same dashboard.

You can also do this entirely in the web UI: **Deploy → from docker-compose**,
paste `docker-compose.yaml`, deploy.

---

## 3b. Deploy on self-hosted dstack

If you're running your own dstack stack (TDX host + dstack VMM + gateway):

1. Make sure the VMM and gateway are up and you can reach the VMM UI.
2. Deploy the same `docker-compose.yaml` through the VMM web UI (or the dstack
   CLI against your VMM endpoint).
3. The gateway maps the app the same way: `https://<app-id>-3000.<your-gateway-domain>`.

The compose contract is identical to Phala Cloud — only where you submit it changes.

Ask Andrew if you want to deploy onto the team's own dstack rather than Phala Cloud.

---

## Notes specific to this app

- **No env vars, no secrets, no backend today.** It's a client-rendered demo —
  the data lives in `src/lib/pitchrotator-demo.ts`. Nothing sensitive ships in
  the image, so a public registry is fine.
- **When the agents/model calls get added** (the README anticipates remote model
  calls), they'll need API keys. On dstack, inject those as **encrypted secrets /
  env** through the Phala Cloud dashboard or VMM — do *not* bake them into the
  image or commit them. That's also where the TEE earns its keep: the key only
  exists inside the attested CVM.
- The server binds `0.0.0.0:3000` (`HOSTNAME`/`PORT` in the Dockerfile) so the
  gateway can reach it. Don't change that to localhost.
