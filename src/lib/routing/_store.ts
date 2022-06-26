import { writable } from 'svelte/store';
const _page = writable({});
const _navigation = writable(null);

export { _page, _navigation }