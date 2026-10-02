const skills = [
  ['Docker', 'docker/docker-original.svg'],
  ['AWS', 'amazonwebservices/amazonwebservices-original-wordmark.svg'],
  ['Git', 'git/git-original.svg'],
  ['GitHub', 'github/github-original.svg'],
  ['Linux', 'linux/linux-original.svg'],
  ['AI agents', 'langchain/langchain-original.svg'],
  ['CI/CD', 'githubactions/githubactions-original.svg'],
  ['Postgres', 'postgresql/postgresql-original.svg'],
];
const list = document.querySelector('.skills');
for (const [name, path] of skills) {
  const item = document.createElement('li');
  const image = document.createElement('img');
  const localNames = { Docker: 'docker', AWS: 'aws', Git: 'git', GitHub: 'github', Linux: 'linux', 'AI agents': 'agents', 'CI/CD': 'cicd', Postgres: 'postgres' };
  image.src = localNames[name] ? `assets/icons/${localNames[name]}.svg` : `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/${path}`;
  image.alt = name;
  image.width = image.height = 48;
  item.append(image);
  list.append(item);
}
const more = document.createElement('li');
more.className = 'more'; more.textContent = 'and more...'; list.append(more);

const dialog = document.querySelector('#shell-dialog');
const output = document.querySelector('#shell-text');
const quotes = {
  pizza: "My favorite pizza comes from Otto's in New York. And, no, I am not trying to be different.",
  tennis: 'Top 10 player in my conference multiple years in a row and top 50 in New England. However, the glory days may be over now...',
};
let frame = 0;
let initiator;
function stopTyping() { cancelAnimationFrame(frame); frame = 0; }
for (const button of document.querySelectorAll('[data-shell]')) {
  button.addEventListener('click', () => {
    stopTyping(); initiator = button; output.textContent = '';
    document.querySelector('#shell-title').textContent = `dean@macintosh: ~/${button.dataset.shell}`;
    dialog.showModal();
    const quote = quotes[button.dataset.shell];
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { output.textContent = quote; return; }
    let start;
    function type(now) {
      start ??= now;
      const count = Math.min(quote.length, 1 + Math.floor((now - start) / 400 * quote.length));
      output.textContent = quote.slice(0, count);
      if (count < quote.length) frame = requestAnimationFrame(type);
    }
    frame = requestAnimationFrame(type);
  });
}
function closeShell() { stopTyping(); output.textContent = ''; dialog.close(); }
document.querySelector('#shell-close').addEventListener('click', closeShell);
dialog.addEventListener('cancel', () => { stopTyping(); output.textContent = ''; });
dialog.addEventListener('close', () => { if (dialog.open) return; stopTyping(); output.textContent = ''; initiator?.focus(); });
dialog.addEventListener('keydown', event => {
  if (event.key === 'Tab') { event.preventDefault(); document.querySelector('#shell-close').focus(); }
});
