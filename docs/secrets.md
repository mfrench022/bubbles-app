# Secret handling for Bubbles

This app is a client-side Expo / React Native project. That means any value shipped
inside the app bundle can be extracted by users.

## Rules

1. Do not commit API keys, tokens, certificates, or service account files.
2. Use `.env.local` or another ignored `.env.*` file for local development values.
3. Only expose values with the `EXPO_PUBLIC_` prefix when they are safe to be public.
4. Keep truly private secrets on a backend you control, then call that backend from
   the app instead of calling privileged third-party APIs directly.
5. For CI/CD or EAS builds, store secrets in the deployment platform's secret store
   rather than in the repository.

## Examples

- Safe in app config: public base URLs, feature flags, publishable client IDs.
- Not safe in app code: server API keys, OAuth client secrets, signing keys, service
  account JSON, database credentials.

## GitHub secret scanning alert

If GitHub flags a secret inside `node_modules` or another generated folder:

1. Add that folder to `.gitignore`.
2. Remove it from git tracking with `git rm --cached`.
3. Rotate the flagged credential if it belongs to you.
4. Push the cleanup commit, then mark the alert resolved in GitHub if appropriate.
