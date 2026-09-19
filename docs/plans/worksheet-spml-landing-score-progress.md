# Rencana Integrasi Skor dan Progress pada Worksheet SPML Landing

## Tujuan

Mengambil data endpoint skor SPML seluruh KPPN pada `WorksheetSPMLLanding`, menyimpannya dalam state bertipe khusus, dan menampilkan progress pengisian KPPN/Kanwil pada setiap `KPPNSelectionCard` berdasarkan jumlah checklist yang telah diisi.

## Temuan dan kebutuhan backend

Endpoint bulk saat ini menyediakan:

- jumlah seluruh checklist;
- jumlah N/A;
- jumlah checklist pembagi;
- total skor konversi.

Data tersebut belum cukup untuk menghitung progress pengisian karena skor 0 yang sudah diisi dan skor `null` sama-sama tidak menambah `totalSkorKonversi`.

Tambahkan pada `SPMLScoreDetail`:

```ts
jumlahChecklistDiisi: number
```

Rumus per penilai:

```ts
jumlahChecklistDiisi = rows.filter(
  row => row[scoreKey] !== null || row.excluded === 1
).length
```

Dengan aturan tersebut:

- skor `10` dihitung sudah diisi;
- skor `0` dihitung sudah diisi;
- skor `null` non-N/A dihitung belum diisi;
- checklist N/A (`excluded = 1`) dihitung sudah diisi.

Properti ini ditambahkan pada detail KPPN dan Kanwil di endpoint single maupun bulk karena keduanya menggunakan kontrak `SPMLScoreDetail` yang sama.

## Tipe frontend

Perluas `SPMLScoreDetail` dengan `jumlahChecklistDiisi`.

Tambahkan tipe response item bulk:

```ts
interface AllKPPNSPMLScoreType extends SPMLScoreType {
  worksheetSPMLId: string;
  kppnId: string;
  name: string;
  alias: string;
}
```

`WorksheetSPMLLanding` menggunakan:

```ts
const [spmlScores, setSpmlScores] = useState<AllKPPNSPMLScoreType[]>([]);
```

Hapus penggunaan `KPPNScoreProgressResponseType` milik modul PB.

## Pemanggilan endpoint di landing

- Gunakan period aktif dari `auth.period`.
- Jangan melakukan request jika:
  - user bukan Kanwil; atau
  - `auth.period` belum tersedia.
- Panggil:

  ```http
  GET /scoringEngine/spml/period/:periodId
  ```

- Simpan `response.data.rows` ke state `spmlScores`.
- Gunakan `try/catch/finally` agar loading overlay selalu berhenti.
- Gunakan error handling bertipe `unknown`/`isAxiosError`, bukan `any`.
- Jika request gagal, state dikosongkan dan snackbar menampilkan pesan error.
- Effect bergantung pada role/KPPN/period yang relevan atau diberi guard yang tepat agar tidak memanggil endpoint dengan nilai `null`.

## Perhitungan progress kartu

Untuk setiap KPPN:

```ts
percentKPPN = jumlahChecklist > 0
  ? jumlahChecklistDiisiKPPN / jumlahChecklist * 100
  : 0;

percentKanwil = jumlahChecklist > 0
  ? jumlahChecklistDiisiKanwil / jumlahChecklist * 100
  : 0;
```

Gunakan detail masing-masing penilai:

- `item.detailKPPN.jumlahChecklistDiisi`;
- `item.detailKanwil.jumlahChecklistDiisi`.

Jangan memakai nilai akhir atau total skor konversi sebagai progress.

## Mapping kartu

Perbaiki mapping response baru:

- `header={item.alias}`;
- `kppnId={item.kppnId}`;
- link menggunakan `item.kppnId`, bukan `item.id`:

  ```ts
  `/worksheet/spml/kppn?id=${item.kppnId}`
  ```

- Gunakan `key={item.worksheetSPMLId}` agar key stabil.
- Pertahankan urutan card dari endpoint yang sudah mengikuti `kppn_ref.col_order`.
- Mapping gambar berdasarkan index dapat dipertahankan selama urutan unit tetap sama; gunakan fallback gambar bila jumlah KPPN melebihi daftar aset.

## Tampilan `KPPNSelectionCard`

- Progress utama tetap menampilkan persentase Kanwil.
- Tooltip tetap menampilkan progress KPPN.
- Format persentase dibatasi 0–100 dan dibulatkan untuk tampilan.
- Perbarui teks tooltip agar menyertakan jumlah aktual, misalnya:

  ```text
  Progress KPPN: 8/10 checklist (80%)
  ```

- Tambahkan props jumlah selesai/total jika informasi pecahan tersebut akan ditampilkan. Jika hanya persen yang dipertahankan, signature card tidak perlu diperluas.

## Pengujian backend

Perbarui unit test ScoringEngine:

1. Skor 10 dihitung selesai.
2. Skor 0 dihitung selesai.
3. Skor null non-N/A belum selesai.
4. N/A dihitung selesai walaupun score penilai masih null.
5. Detail bulk tiap KPPN memiliki `jumlahChecklistDiisi` yang benar.

## Verifikasi frontend

1. Role 99/4/3 memanggil endpoint menggunakan period aktif.
2. User KPPN langsung diarahkan ke workspace dan tidak memanggil endpoint bulk.
3. Card memakai `kppnId` dan link yang benar.
4. Checklist bernilai 0 meningkatkan progress.
5. Checklist N/A meningkatkan progress.
6. Checklist null non-N/A tidak meningkatkan progress.
7. Total kosong menghasilkan 0%, bukan `NaN`.
8. Frontend dan backend build berhasil.
9. Unit test ScoringEngine dan ESLint terarah berhasil.

## File yang diperkirakan berubah

Backend:

- `backend/src/model/scoringEngine.model.ts`
- `backend/__test__/model/scoringEngine.model.test.ts`

Frontend:

- `frontend/src/sections/worksheetSPML/types.ts`
- `frontend/src/sections/worksheetSPML/WorksheetSPMLLanding.tsx`
- Opsional `frontend/src/sections/worksheetSPML/components/KPPNSelectionCard.tsx` jika jumlah selesai/total ditampilkan pada tooltip.
