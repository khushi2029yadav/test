import { SkyGuardProvider } from './context/SkyGuardContext';
import { AppShell } from './components/layout/AppShell';

export function App() {
  return (
    <SkyGuardProvider>
      <AppShell />
    </SkyGuardProvider>
  );
}

export default App;
