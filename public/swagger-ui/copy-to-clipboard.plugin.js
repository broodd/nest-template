setTimeout(() => {
  const btns = document.querySelectorAll('blockquote > p');
  btns.forEach((item) =>
    item.addEventListener('click', (e) => {
      navigator.clipboard.writeText(e.target.innerText);
    }),
  );

  const list = document.querySelectorAll('ul > li');
  list.forEach((item) =>
    item.addEventListener('click', (e) => {
      navigator.clipboard.writeText(e.target.parentElement.nextElementSibling.innerText);
    }),
  );
}, 2000);
