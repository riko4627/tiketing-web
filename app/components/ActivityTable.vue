<script setup>
const activities = [
  { id: 'ACT-001', user: 'Dimas Aditya', action: 'Update Berkas Laporan Bulanan Utama', date: '21 Juni 2026', time: '14:23', status: 'Success' },
  { id: 'ACT-002', user: 'Clara Angelica', action: 'Hapus Data Transaksi Duplikat', date: '21 Juni 2026', time: '13:05', status: 'Success' },
  { id: 'ACT-003', user: 'Rian Hidayat', action: 'Upload Konfigurasi Server Utama', date: '20 Juni 2026', time: '18:50', status: 'Pending' },
  { id: 'ACT-004', user: 'Siti Rahma', action: 'Edit Data Profil Karyawan & Hak Akses', date: '20 Juni 2026', time: '11:15', status: 'Failed' },
  { id: 'ACT-005', user: 'Ahmad Yusuf', action: 'Ekspor Dokumen Laporan Tahunan PDF', date: '19 Juni 2026', time: '16:40', status: 'Success' }
]
</script>

<template>
  <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
    <div class="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/20">
      <div>
        <h3 class="font-bold text-zinc-900 dark:text-white">Aktifitas Terkini</h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Daftar tindakan administratif terbaru dalam sistem portal.</p>
      </div>
      <button class="text-xs font-semibold text-indigo-650 dark:text-indigo-400 hover:underline">
        Lihat Semua
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-800/10">
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Pengguna</th>
            <th class="px-6 py-4">Aktivitas</th>
            <th class="px-6 py-4">Tanggal & Waktu</th>
            <th class="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm text-zinc-700 dark:text-zinc-350">
          <tr v-for="item in activities" :key="item.id" class="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
            <td class="px-6 py-4 font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400">{{ item.id }}</td>
            <td class="px-6 py-4 font-semibold text-zinc-900 dark:text-white">{{ item.user }}</td>
            <td class="px-6 py-4 max-w-xs truncate" :title="item.action">{{ item.action }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div>{{ item.date }}</div>
              <div class="text-xs text-zinc-400 mt-0.5">{{ item.time }} WIB</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                  item.status === 'Success' && 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
                  item.status === 'Pending' && 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
                  item.status === 'Failed' && 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
                ]"
              >
                <span
                  :class="[
                    'w-1.5 h-1.5 rounded-full',
                    item.status === 'Success' && 'bg-emerald-500',
                    item.status === 'Pending' && 'bg-amber-500',
                    item.status === 'Failed' && 'bg-rose-500'
                  ]"
                ></span>
                {{ item.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
