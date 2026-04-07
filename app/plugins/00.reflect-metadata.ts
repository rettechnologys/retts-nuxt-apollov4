import 'reflect-metadata';

export default defineNuxtPlugin(() => {
  // noop - import side-effect only
  console.log('[ReflectMetadata] polyfill loaded on server');
});