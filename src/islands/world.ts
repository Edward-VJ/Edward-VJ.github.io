/**
 * The courtyard world island. PS-2 ships a placeholder that proves the boot mechanism
 * (a bundled click handler dynamically imports this module); PS-8 replaces the body.
 */
export function mount(el: HTMLElement): void {
  el.innerHTML = '';
  const p = document.createElement('p');
  p.className = 'sans';
  p.textContent = 'The courtyard is being built in step PS-8. This message came from the island module loaded on demand.';
  el.appendChild(p);
  el.dataset.island = 'world';
}
