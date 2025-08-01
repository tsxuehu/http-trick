import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ServiceRegistry } from "@spring4js/container-browser";
import services from "./config/service-info.ts";
import { getServiceSync, setServiceRegistry } from "@spring4js/container-browser/lib/esm/global-fn";
import EService from "./config/EService.ts";
import IWorkbenchService from "./service-api/IWorkbenchService.ts";


const workbenchService = getServiceSync<IWorkbenchService>(EService.IWorkbenchService);

async function init() {

  const registry = new ServiceRegistry();
  registry.registerServiceBatch(services);
  setServiceRegistry(registry);

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
  );

  document.addEventListener('keydown', function (event) {
    if((event.ctrlKey || event.metaKey) && event.code  == 'KeyS') {
      // Save Function
      event.preventDefault();
      return false;
    }
  },true);

  await workbenchService.start({});
}

init();
