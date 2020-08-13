import { getElementFromTemplate } from "./../utils/utils";
import axios from 'axios';

const MIN_ITEMS_TO_SHOW = 2;

class Partner {
  constructor(blockEl) {
    this.listEl = blockEl.querySelector('.partners__list');
    this.loadingLinkEl = blockEl.querySelector('.partners__link');
    this.loadingLink = this.loadingLinkEl.dataset.link;
    this.loadedItems = [...blockEl.querySelectorAll('.partners__item')];
    this.loadedItemsCount = this.loadedItems.length;
    this.itemsToShow = this.loadedItems.length;
    this.showedItemsEl = blockEl.querySelector('.partners__count--current');
    this.totatlItems = +blockEl.querySelector('.partners__count--total').textContent;
    this.hideItemsEl = getElementFromTemplate( `<button class="partners__hide-button" type="button">Скрыть</button>`);

    this.init()
  }

  init() {
    if (this.loadingLinkEl) {
      this.loadingLinkEl.addEventListener('click', (evt) => {
        evt.preventDefault();
        if (this.loadedItemsCount < this.totatlItems) {
          this.loadItems();
        } else {
          this.itemsToShow += Math.min(MIN_ITEMS_TO_SHOW, this.totatlItems - this.itemsToShow);
          this.showItems(this.itemsToShow);
        }
      });
    }
    this.hideItemsEl.addEventListener('click', () => {
      this.showMinItems();
    })
  }

  showItems(value) {
    this.showedItemsEl.textContent = value;
    this.listEl.innerHTML = '';
    this.loadedItems
      .filter((item, index) => index < value)
      .forEach((itemEl, index) => {
        this.listEl.appendChild(itemEl);
      });
    if (value === this.totatlItems) {
      this.loadingLinkEl.parentNode.insertBefore(this.hideItemsEl, this.loadingLinkEl);
      this.loadingLinkEl.remove();
    } else {
      if (!this.loadingLinkEl.parentNode) {
        this.hideItemsEl.parentNode.insertBefore(this.loadingLinkEl, this.hideItemsEl);
        this.hideItemsEl.remove();
      }
    }
  }

  showMinItems() {
    this.itemsToShow = MIN_ITEMS_TO_SHOW;
    this.showItems(this.itemsToShow);
    this.listEl.scrollIntoView({
      behavior: 'smooth'
    })
  }

  loadItems() {
    axios.get(this.loadingLink)
      .then(({data}) => {
        const newItems = data
          .filter((item, index) => index < this.totatlItems - this.loadedItemsCount) // супер хак. Сервер не должен отдавать боьше максимума
          .map(item => getElementFromTemplate(`
              <li class="partners__item">
                <a href="${item.link}" class="partner">
                  <img src="${item.img}" alt="${item.name}" class="partner__img">
                  <div class="partner__about">
                    <h3 class="partner__name">${item.name}</h3>
                    <p class="partner__description">${item.description}</p>
                  </div>
                </a>
              </li>
            `, 'ul')
          );
        newItems.forEach(itemEl => {
          this.loadedItems.push(itemEl);
        });

        this.loadedItemsCount += newItems.length;
        this.showItems(this.loadedItemsCount)
      })
  }
}

document.querySelectorAll('.partners').forEach(partnersEl => new Partner(partnersEl));
