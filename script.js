const currentModuleUrl = new URL(import.meta.url);
const currentModuleDir = currentModuleUrl.pathname.split('/').slice(0, -1).join('/');