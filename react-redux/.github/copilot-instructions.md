# Copilot / AI agent instructions for this repo

**Summary:** Small React + Vite frontend (in `frondend/`) and a simple JSON-based backend (in `backend/server/`). The repo is arranged to run locally via Vite for development or via Docker Compose for a production-like preview.

**Start (quick):**
- Frontend dev: run `npm install` then `npm run dev` inside `frondend/` (Vite, HMR).
- Full stack (containers): from project root run `docker-compose up --build` — this builds `frondend` and `backend/server` images. Frontend served at port `3001`, json-server at `5000`.

**Key files & responsibilities:**
- `frondend/src/slices/taskSlice.js`: Redux Toolkit slice + async thunks. Thunks call `http://localhost:5000/tasks` (GET/POST). Look here for network flow and error handling pattern (`rejectWithValue({error: ...})`).
- `frondend/src/store/store.js`: store setup. Root reducer exposes `state.tasks`.
- `frondend/src/components/*`: small presentational + container components. `AddTask.jsx` uses `addTaskToServer` thunk; `ListTask.jsx` dispatches `getTasksFromServer` on mount; `UpdateTask.jsx` updates local state via `updateTaskInList` reducer.
- `backend/server/Dockerfile` + `backend/server/db.json`: dockerized `json-server` used by `docker-compose.yml`. This is the effective backend in docker-compose.
- `backend/data.js`: an express/mysql example that is not used by docker-compose — be cautious: there are two backend approaches present.

**Behavioral notes agents must know**
- The app mixes client-only state updates and server-backed calls: POST and GET are implemented against json-server (see `taskSlice`), but delete/update flows in the UI often only mutate client state (`removeTaskFromList`, `updateTaskInList`) without calling the server. When making changes, reconcile whether a change should also modify `db.json` (and thus json-server behavior).
- Async thunks return `rejectWithValue({error: <msg>})` and reducers expect `action.payload.error`. Preserve or adapt that shape if you modify error handling.
- Selectors and reducers expect the store slice under `state.tasks`.

**Dev commands & debugging**
- Start frontend (fast dev):
  - cd frondend
  - npm install
  - npm run dev
- Start full stack (docker):
  - docker-compose up --build
  - frontend: http://localhost:3001
  - api (json-server): http://localhost:5000/tasks
- If you need to run json-server standalone: `npx json-server --watch backend/server/db.json --port 5000`.

**Conventions & patterns**
- Redux Toolkit is used with `createSlice` + `createAsyncThunk`. Follow the naming pattern `getXFromServer`, `addXToServer` for thunks and `XInList` for pure reducers.
- Network requests are simple `fetch` calls in thunks (no axios). They assume `Content-type: application/json` for POST.
- Components are functional React with hooks (`useState`, `useEffect`, `useDispatch`, `useSelector`, `useNavigate`). Keep router navigation consistent with `react-router-dom` v7.
- Tailwind classes are used heavily in components — keep className formatting consistent with existing files.

**When editing or extending**
- If you implement server-side delete/update, update `taskSlice` to add corresponding async thunks and change UI handlers that currently call client-only reducers.
- If changing the API port or host, update all references to `http://localhost:5000` in `frondend/src/slices/taskSlice.js`.
- Prefer minimal, surgical changes: preserve the existing `rejectWithValue({error: ...})` error shape unless you update all reducers that consume it.

**Files to inspect for examples**
- `frondend/src/slices/taskSlice.js` — async thunks and reducer examples
- `frondend/src/store/store.js` — store wiring
- `frondend/src/components/AddTask.jsx`, `ListTask.jsx`, `UpdateTask.jsx` — component patterns
- `docker-compose.yml`, `frondend/Dockerfile`, `backend/server/Dockerfile` — container setup

If anything in this summary is unclear or you want the instructions to emphasize a particular workflow (e.g., prefer containerized dev vs local Vite), tell me which and I will iterate.
