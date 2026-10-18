const dialog = document.querySelector('#shell-dialog');
const output = document.querySelector('#shell-text');
const quotes = {
  pizza: "My favorite pizza comes from Ops in New York. And, no, I am not trying to be different.",
  tennis: 'Top 10 player in my conference multiple years in a row and top 50 in New England. However, the glory days may be over now...',
};
let initiator;
for (const button of document.querySelectorAll('[data-shell]')) {
  button.addEventListener('click', () => {
    initiator = button;
    output.textContent = quotes[button.dataset.shell];
    document.querySelector('#shell-title').textContent = `dean: ~/${button.dataset.shell}`;
    dialog.showModal();
  });
}
document.querySelector('#shell-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => initiator?.focus());
