<!-- 📊 CMS Dashboard -->
<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>CMS Dashboard</h1>
      <p class="text-muted">Overview, quick stats, recent activity</p>
    </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <Card v-for="stat in stats" :key="stat.label" class="stat-card">
          <template #content>
            <div class="stat-content">
              <i
                :class="stat.icon"
                class="stat-icon"
                :style="{ color: stat.color }"
              ></i>
              <div class="stat-details">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
                <div class="stat-change" :class="stat.trend">
                  <i
                    :class="
                      stat.trend === 'up'
                        ? 'pi pi-arrow-up'
                        : 'pi pi-arrow-down'
                    "
                  ></i>
                  {{ stat.change }}
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Charts Row -->
      <div class="charts-row">
        <Card class="chart-card">
          <template #title>Page Views (Last 30 Days)</template>
          <template #content>
            <!-- <Chart type="line" :data="pageViewsData" :options="chartOptions" /> -->
          </template>
        </Card>

        <Card class="chart-card">
          <template #title>Content Distribution</template>
          <template #content>
            <!-- <Chart
            type="doughnut"
            :data="contentDistributionData"
            :options="doughnutOptions"
          /> -->
          </template>
        </Card>
      </div>

      <!-- Recent Activity -->
      <Card class="recent-activity">
        <template #title>Recent Activity</template>
        <template #content>
          <Timeline :value="recentActivities">
            <template #content="slotProps">
              <div class="activity-item">
                <div class="activity-header">
                  <span class="activity-user">{{ slotProps.item.user }}</span>
                  <span class="activity-action">{{
                    slotProps.item.action
                  }}</span>
                </div>
                <div class="activity-target">{{ slotProps.item.target }}</div>
                <small class="activity-time">{{ slotProps.item.time }}</small>
              </div>
            </template>
            <template #marker="slotProps">
              <i
                :class="slotProps.item.icon"
                :style="{ color: slotProps.item.color }"
              ></i>
            </template>
          </Timeline>
        </template>
      </Card>

      <!-- Quick Actions -->
      <Card class="quick-actions">
        <template #title>Quick Actions</template>
        <template #content>
          <div class="actions-grid">
            <Button
              label="Create New Page"
              icon="pi pi-file"
              @click="navigateTo('/admin/pages/create')"
            />
            <Button
              label="Add Blog Post"
              icon="pi pi-pencil"
              @click="navigateTo('/admin/collections/blog/create')"
            />
            <Button
              label="Upload Media"
              icon="pi pi-image"
              @click="navigateTo('/admin/media')"
              severity="secondary"
            />
            <Button
              label="Manage Menus"
              icon="pi pi-bars"
              @click="navigateTo('/admin/settings/menus')"
              severity="secondary"
            />
          </div>
        </template>
      </Card>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});

const stats = ref([
  {
    label: 'Total Pages',
    value: '42',
    change: '+12%',
    trend: 'up',
    icon: 'pi pi-file',
    color: '#3B82F6',
  },
  {
    label: 'Blog Posts',
    value: '128',
    change: '+8%',
    trend: 'up',
    icon: 'pi pi-pencil',
    color: '#10B981',
  },
  {
    label: 'Page Views',
    value: '12.5K',
    change: '+23%',
    trend: 'up',
    icon: 'pi pi-eye',
    color: '#F59E0B',
  },
  {
    label: 'Media Files',
    value: '256',
    change: '+15%',
    trend: 'up',
    icon: 'pi pi-images',
    color: '#8B5CF6',
  },
]);

const pageViewsData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Page Views',
      data: [3000, 4200, 3800, 5100, 4800, 6200, 5900],
      fill: true,
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    },
  ],
});

const contentDistributionData = ref({
  labels: ['Pages', 'Blog Posts', 'Products', 'Projects'],
  datasets: [
    {
      data: [42, 128, 64, 32],
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
});

const doughnutOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
});

const recentActivities = ref([
  {
    user: 'John Doe',
    action: 'published',
    target: 'Blog Post: "Getting Started with Nuxt 4"',
    time: '5 minutes ago',
    icon: 'pi pi-check-circle',
    color: '#10B981',
  },
  {
    user: 'Jane Smith',
    action: 'updated',
    target: 'Page: "About Us"',
    time: '15 minutes ago',
    icon: 'pi pi-pencil',
    color: '#3B82F6',
  },
  {
    user: 'Admin',
    action: 'uploaded',
    target: '5 images to Media Library',
    time: '1 hour ago',
    icon: 'pi pi-upload',
    color: '#8B5CF6',
  },
  {
    user: 'John Doe',
    action: 'created',
    target: 'Template: "Product Listing"',
    time: '2 hours ago',
    icon: 'pi pi-plus-circle',
    color: '#F59E0B',
  },
]);
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.text-muted {
  color: #6b7280;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-content {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-details {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.stat-change {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.stat-change.up {
  color: #10b981;
}

.stat-change.down {
  color: #ef4444;
}

.charts-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card :deep(.p-card-content) {
  height: 300px;
}

.recent-activity {
  margin-bottom: 2rem;
}

.activity-item {
  padding: 0.5rem 0;
}

.activity-header {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.activity-user {
  font-weight: 600;
}

.activity-action {
  color: #6b7280;
}

.activity-target {
  margin-top: 0.25rem;
  font-size: 0.875rem;
}

.activity-time {
  color: #9ca3af;
  font-size: 0.75rem;
}

.quick-actions {
  margin-top: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

@media (max-width: 768px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
}
</style>
