<script setup>
import StatCard from '~/components/StatCard.vue'
import ActivityTable from '~/components/ActivityTable.vue'

definePageMeta({
  layout: 'admin'
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header Page Title -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Overview Dashboard</h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Selamat datang kembali! Berikut adalah ringkasan performa sistem dan data terkini.</p>
      </div>
      
      <!-- Date Picker Mock -->
      <div class="flex items-center gap-2.5 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm text-xs font-semibold text-zinc-700 dark:text-zinc-300">
        <svg class="w-4 h-4 text-zinc-450" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>21 Juni 2026</span>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard title="Total Pendapatan" value="Rp 48.2 M" change="+12%" :is-positive="true" color="indigo">
        <template #icon>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16V3" />
          </svg>
        </template>
      </StatCard>

      <StatCard title="Transaksi Baru" value="1,240 Transaksi" change="+4.2%" :is-positive="true" color="green">
        <template #icon>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </template>
      </StatCard>

      <StatCard title="User Aktif (Hari Ini)" value="1,842" change="+28.4%" :is-positive="true" color="amber">
        <template #icon>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </template>
      </StatCard>

      <StatCard title="Pemakaian Bandwidth API" value="84.2%" change="+5.1%" :is-positive="false" color="rose">
        <template #icon>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm9-1v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2z" />
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- Data Visualization Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Activity Chart (Left Column, 2/3 width) -->
      <div class="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-bold text-zinc-900 dark:text-white">Analitik Pengunjung & Transaksi</h3>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Grafik perbandingan performa traffic dan transaksi 6 bulan terakhir.</p>
            </div>
            <select class="px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none dark:text-zinc-300">
              <option>6 Bulan Terakhir</option>
              <option>1 Bulan Terakhir</option>
            </select>
          </div>

          <!-- Clean Mock Line/Area Chart using SVG -->
          <div class="h-64 mt-6 flex items-end relative">
            <div class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 dark:opacity-10 text-[10px] font-mono">
              <div class="border-b border-zinc-650 dark:border-zinc-300 w-full pb-1">100k req</div>
              <div class="border-b border-zinc-650 dark:border-zinc-300 w-full pb-1">75k req</div>
              <div class="border-b border-zinc-650 dark:border-zinc-300 w-full pb-1">50k req</div>
              <div class="border-b border-zinc-650 dark:border-zinc-300 w-full pb-1">25k req</div>
              <div class="w-full border-b border-zinc-650 dark:border-zinc-350">0</div>
            </div>

            <!-- SVG Chart Lines -->
            <svg class="w-full h-[85%] z-10" viewBox="0 0 600 200" preserveAspectRatio="none">
              <!-- Gradient fill -->
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.25"/>
                  <stop offset="100%" stop-color="#4f46e5" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <!-- Filled Area -->
              <path d="M 0 170 Q 120 80, 240 120 T 480 30 T 600 90 L 600 200 L 0 200 Z" fill="url(#chartGrad)" />
              <!-- Smooth Line -->
              <path d="M 0 170 Q 120 80, 240 120 T 480 30 T 600 90" fill="none" stroke="#4f46e5" stroke-width="3" stroke-linecap="round" />
              <!-- Secondary Comparison Line (Dashed) -->
              <path d="M 0 190 Q 120 130, 240 150 T 480 70 T 600 120" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4" stroke-linecap="round" class="opacity-60" />
            </svg>
          </div>
          <!-- Months Legend -->
          <div class="flex justify-between px-2 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 mt-2.5">
            <span>Januari</span>
            <span>Februari</span>
            <span>Maret</span>
            <span>April</span>
            <span>Mei</span>
            <span>Juni</span>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-5 mt-6 border-t border-zinc-100 dark:border-zinc-800 pt-4 text-xs font-medium">
          <div class="flex items-center gap-2">
            <span class="w-3 h-1.5 rounded-full bg-indigo-650"></span>
            <span class="text-zinc-650 dark:text-zinc-300">Tahun Ini</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-1.5 rounded-full bg-emerald-500"></span>
            <span class="text-zinc-650 dark:text-zinc-300">Tahun Lalu</span>
          </div>
        </div>
      </div>

      <!-- System Health Card (Right Column, 1/3 width) -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
        <div>
          <h3 class="font-bold text-zinc-900 dark:text-white">Status Server & Sistem</h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Status dan performa infrastruktur server utama.</p>
          
          <div class="mt-6 space-y-4">
            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-zinc-500">CPU Load</span>
                <span class="text-zinc-950 dark:text-white">24%</span>
              </div>
              <div class="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div class="bg-indigo-650 h-full rounded-full" style="width: 24%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-zinc-500">RAM Usage</span>
                <span class="text-zinc-950 dark:text-white">58%</span>
              </div>
              <div class="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-full rounded-full" style="width: 58%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-zinc-500">Disk Storage</span>
                <span class="text-zinc-950 dark:text-white">42%</span>
              </div>
              <div class="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div class="bg-amber-500 h-full rounded-full" style="width: 42%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6 flex justify-between items-center text-xs font-semibold">
          <span class="text-zinc-500">Status Gateway:</span>
          <span class="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-450">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Operasional
          </span>
        </div>
      </div>
    </div>

    <!-- Recent Activities Table -->
    <ActivityTable />
  </div>
</template>
