<!-- MarketplaceView.vue -->
<template>
  <div class="container-fluid page-layout">
    <!-- inserting carousel component here -->
    <CarouselMarketplace />
    <div class="row">
      <!-- Sidebar Filter on the Left -->
      <div class="col-md-3 filter-container">
        <CreateDonationForm @notification="handleNotification" />
        <FilterSidebar :isDateFilterOpen.sync="isDateFilterOpen" :isConditionFilterOpen.sync="isConditionFilterOpen"
          :isItemCategoryFilterOpen.sync="isItemCategoryFilterOpen" :isPetTypeFilterOpen.sync="isPetTypeFilterOpen"
          :isLocationFilterOpen.sync="isLocationFilterOpen" @update:isDateFilterOpen="isDateFilterOpen = $event"
          @update:isConditionFilterOpen="isConditionFilterOpen = $event"
          @update:isItemCategoryFilterOpen="isItemCategoryFilterOpen = $event"
          @update:isPetTypeFilterOpen="isPetTypeFilterOpen = $event"
          @update:isLocationFilterOpen="isLocationFilterOpen = $event" @filter="applyFilters" />
      </div>

      

      <!-- Donation List in the Center with Pagination -->
      <div class="col-md-9">
        <div v-if="notificationMessage" :class="`alert alert-${notificationType} alert-dismissible fade show`"
          role="alert">
          {{ notificationMessage }}
          <button type="button" class="btn-close" @click="clearNotification" aria-label="Close"></button>
        </div>
        <!-- Direct Donation List -->
        <DonationList :donations="paginatedDonations" @notification="handleNotification" />


        <br>
        <!-- Faint Divider Line -->
        <hr class="divider-line" />

        <!-- Pagination Controls -->
        <div class="pagination-container">
          <button :disabled="currentPage === 1" @click="prevPage" class="btn btn-outline-primary">
            Previous
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button :disabled="currentPage === totalPages" @click="nextPage" class="btn btn-outline-primary">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FilterSidebar from './FilterSidebar.vue';
import DonationList from './DonationList.vue';
import CreateDonationForm from './CreateDonationForm.vue';
import CarouselMarketplace from './CarouselMarketplace.vue';

export default {
  components: {
    FilterSidebar,
    DonationList,
    CreateDonationForm,
    CarouselMarketplace,
  },
  data() {
    return {
      isDateFilterOpen: false,
      isConditionFilterOpen: false,
      isItemCategoryFilterOpen: false,
      isPetTypeFilterOpen: false,
      isLocationFilterOpen: false,
      donations: [], // Full list of donations
      filteredDonations: [], // Filtered and sorted list of donations
      currentPage: 1,
      itemsPerPage: 9,
      selectedFilters: {}, // Holds applied filters
      notificationMessage: '',
      notificationType: '', // success or error
    };
  },
  computed: {
    // Apply pagination to the filtered donations
    paginatedDonations() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredDonations.slice(start, end);
    },
    // Calculate total pages for the filtered donations
    totalPages() {
      return Math.ceil(this.filteredDonations.length / this.itemsPerPage);
    },
  },
  methods: {
    clearNotification() {
      this.notificationMessage = '';
      this.notificationType = '';
    },
    // Add this method to handle emitted notifications
    handleNotification({ type, message }) {
      this.notificationMessage = message;
      this.notificationType = type;
      if (type === 'success') {
        // Automatically refresh the page data when a new post is created successfully
        this.fetchDonations();
      }
      setTimeout(() => {
        this.clearNotification();
      }, 3000); // Auto-clear after 3 seconds
    },
    // Fetch donations and set the full and filtered donations list
    async fetchDonations() {
      try {
        const response = await fetch(`${this.$api_url}/marketplace`);
        if (!response.ok) throw new Error('Failed to fetch donations');
        const data = await response.json();
        this.donations = data;
        this.filteredDonations = data; // Initialize with all donations
      } catch (error) {
        console.error('Error fetching donations:', error);
      }
    },
    // Apply the filters to the donations
    applyFilters(filters) {
      this.selectedFilters = filters;
      let filtered = this.donations.filter(donation => {
        const matchesCondition = !filters.conditions.length || filters.conditions.includes(donation.condition);
        const matchesCategory = !filters.itemCategories.length || filters.itemCategories.includes(donation.itemCategory);
        const matchesPetType = !filters.petTypes.length || filters.petTypes.includes(donation.petType);
        const matchesLocation = !filters.locations.length || filters.locations.includes(donation.location);

        return matchesCondition && matchesCategory && matchesPetType && matchesLocation;
      });

      // Apply sorting by "Most Recent" or "Least Recent"
      if (filters.sortOrder === 'mostRecent') {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (filters.sortOrder === 'leastRecent') {
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }

      this.filteredDonations = filtered;
      this.currentPage = 1; // Reset to the first page after filtering
    },
    // Pagination: go to previous page
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    // Pagination: go to next page
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
  },
  async created() {
    await this.fetchDonations();
  },
};
</script>

<style scoped>
/* Layout styles */

.page-layout {
  background-color: #F8F9FB;
  min-height: 100vh;
  padding-top: 20px;
}

.filter-container {
  background-color: #ffffff;
  padding: 20px;
}

/* .divider-line {
  border: 0;
  height: 1px;
  background-color: linear-gradient(103deg, rgba(252, 238, 213, 0.6) 6.43%, rgba(252, 238, 213, 0.6) 78.33%, rgba(255, 231, 186, 0.6) 104.24%);
  margin: 20px 0;
} */

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.card {
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: scale(1.02);
}

.card-title,
.card-subtitle {
  color: #2c3e50;
}

.card-text {
  color: #5c4033;
}

.btn-outline-primary {
  color: #2c3e50;
  border-color: #2c3e50;
}

.btn-outline-primary:hover {
  background-color: #2c3e50;
  color: #fff;
}
</style>
