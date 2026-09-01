export class EventControl {
  constructor() {
    this.cards = document.querySelectorAll(".card");
    this.input = document.querySelector("#search-title");
    this.chips = document.querySelector(".search__chips");
    this.prev = document.querySelector("#pager-prev");
    this.next = document.querySelector("#pager-next");
    this.status = document.querySelector("#search-status");
    this.empty = document.querySelector("#search-empty");
    this.pager = document.querySelector("#search-pager");
    this.PAGE_SIZE = 6;
    this.page = 0;
  }

  init() {
    this.input?.addEventListener("input", () => {
      this.resetPage();
      this.applyFilters();
    });
    this.chips?.addEventListener("change", () => {
      this.resetPage();
      this.applyFilters();
    });
    this.prev?.addEventListener("click", () => {
      this.stepPage(-1);
      this.applyFilters();
    });
    this.next?.addEventListener("click", () => {
      this.stepPage(1);
      this.applyFilters();
    });
  }

  applyFilters() {
    const q = this.input?.value.trim().toLowerCase() ?? "";
    const selectTag = this.selectedTag();
    const matches = this.getMatchesCard(q, selectTag);
    const totalPages = this.getTotalPages(matches);

    this.cards.forEach((card) => {
      card.hidden = true;
    });
    this.changeStatusPagination(matches, totalPages);
  }

  selectedTag() {
    const checked = document.querySelector("input[name='tag-article']:checked");
    return (checked?.value ?? "").trim().toLowerCase();
  }

  getMatchesCard(q, selectTag) {
    const matches = [];

    this.cards.forEach((card) => {
      const title = card.querySelector(".card__title")?.textContent.toLowerCase() ?? "";
      const allTags = card.querySelectorAll(".card__tag");
      const tags = [...allTags].map((el) => el.textContent.toLowerCase());

      const matchTitle = q === "" || title.includes(q);
      const matchTag = selectTag === "" || tags.some((t) => t.includes(selectTag));
      if (matchTitle && matchTag) {
        matches.push(card);
      }
    });
    return matches;
  }

  getTotalPages(matches) {
    const totalPages = Math.max(1, Math.ceil(matches.length / this.PAGE_SIZE));
    if (this.page > totalPages - 1) {
      this.page = totalPages - 1;
    }
    return totalPages;
  }

  changeStatusPagination(matches, totalPages) {
    const start = this.page * this.PAGE_SIZE;

    matches.slice(start, start + this.PAGE_SIZE).forEach((card) => {
      card.hidden = false;
    });

    if (matches.length === 0) {
      this.setEmptyState();
    } else {
      const from = start + 1;
      const to = start + Math.min(this.PAGE_SIZE, matches.length - start);
      this.setResultsState(from, to, matches.length);
    }

    this.syncPager(matches.length, totalPages);
  }

  setEmptyState() {
    if (this.status) {
      this.status.hidden = true;
      this.status.textContent = "";
    }
    if (this.empty) this.empty.hidden = false;
  }

  setResultsState(from, to, total) {
    if (this.empty) this.empty.hidden = true;
    if (this.status) {
      this.status.hidden = false;
      this.status.textContent = `${from}-${to} de ${total} artículos`;
    }
  }

  syncPager(matchCount, totalPages) {
    if (this.pager) this.pager.hidden = matchCount <= this.PAGE_SIZE;
    if (this.prev) this.prev.disabled = this.page === 0;
    if (this.next) this.next.disabled = this.page >= totalPages - 1;
  }

  resetPage() {
    this.page = 0;
  }

  stepPage(delta) {
    this.page += delta;
  }
}
