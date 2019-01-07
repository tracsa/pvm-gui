const itemFilterMixin = {
  data() {
    return {
      showedItems: [],
      query: '',
      pageSize: process.env.PAGE_SIZE,
      pageNumber: 1,
      menuVisible: false,
      filters: process.env.TRACKINGS_FILTERS.filters,
      order: process.env.TRACKINGS_FILTERS.orderBy,
      orderBy: null,
      appliedFilters: {},
    };
  },
  methods: {
    filterList() {
      if (this.query !== '') {
        this.showedItems = this.filteredData;
      } else {
        this.showedItems = this.items;
      }
      if (this.checkFilters()) {
        this.showedItems = this.filteredDataByAttribute;
      }
      if (this.orderBy !== null) {
        this.showedItems = this.sortedData;
      }
      this.showedItems = this.paginedData;
    },
    initializeAttributeFilters() {
      const filters = Object.keys(this.filters);
      for (let i = 0; i < filters.length; i += 1) {
        this.appliedFilters[filters[i]] = {
          values: [],
        };
      }
    },
    checkFilters() {
      const filters = Object.keys(this.filters);
      for (let i = 0; i < filters.length; i += 1) {
        if (this.appliedFilters[filters[i]].values.length > 0) {
          return true;
        }
      }
      return false;
    },
    toggleMenu: function toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    closeMenu: function closeMenu() {
      // Wait 200ms to handle any click inside menu
      setTimeout(() => {
        this.menuVisible = false;
      }, 200);
    },
    clear: function clear() {
      this.query = '';
      this.orderBy = null;
      this.initializeAttributeFilters();
      this.loadList();
    },
  },
  created() {
    this.initializeAttributeFilters();
  },
  computed: {
    filteredData() {
      const re = new RegExp(this.query, 'i');
      return this.items.filter(item => item.name.match(re));
    },
    paginedData() {
      const begin = this.pageSize * (this.pageNumber - 1);
      return this.showedItems.slice(begin, begin + this.pageSize);
    },
    sortedData() {
      if (this.orderBy === null) {
        return this.showedItems;
      }
      return this.showedItems.slice().sort((a, b) => {
        if (a[this.orderBy] < b[this.orderBy]) {
          return -1;
        } else if (a[this.orderBy] < b[this.orderBy]) {
          return 1;
        }
        return 0;
      });
    },
    filteredDataByAttribute() {
      let result = [];
      const keys = Object.keys(this.appliedFilters);
      const appliedFilters = this.appliedFilters;
      const showedItems = this.showedItems;

      const callback = (item, filter, j) =>
        item[filter] === appliedFilters[filter].values[j] && !result.includes(item);

      for (let i = 0; i < keys.length; i += 1) {
        const filter = keys[i];
        for (let j = 0; j < appliedFilters[filter].values.length; j += 1) {
          result = result.concat(showedItems.filter(item =>
            callback(item, filter, j),
          ));
        }
      }
      return result;
    },
    haveFilters() {
      return Object.keys(this.filters).length > 0;
    },
    haveFiltersOrder() {
      return this.order.length || this.filters.length;
    },
  },
};

export default itemFilterMixin;
