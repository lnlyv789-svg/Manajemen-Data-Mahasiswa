/**
 * Aplikasi Manajemen Data Mahasiswa
 * Implementasi lengkap dengan:
 * - OOP (Class, Object, Enkapsulasi, Pewarisan, Polimorfisme)
 * - CRUD Operations (Array & Pointer/Fungsi)
 * - File I/O (JSON)
 * - Searching Algorithms (Linear, Binary, Sequential)
 * - Sorting Algorithms (Bubble, Insertion, Selection, Merge, Shell)
 * - Regex Validation
 * - Error Handling dengan Try-Catch
 * - Time Complexity Analysis
 * - Best Practices & Modular Code
 */

// ============================================
// KELAS DAN OOP IMPLEMENTASI
// ============================================

/**
 * Kelas abstrak Person sebagai dasar
 * Demonstrasi konsep pewarisan dan enkapsulasi
 */
class Person {
    constructor(nama, tanggalLahir) {
        this._nama = this._validateNama(nama);
        this._tanggalLahir = this._validateTanggalLahir(tanggalLahir);
    }

    // Enkapsulasi: Getter dan Setter dengan validasi
    get nama() {
        return this._nama;
    }

    set nama(value) {
        this._nama = this._validateNama(value);
    }

    get tanggalLahir() {
        return this._tanggalLahir;
    }

    set tanggalLahir(value) {
        this._tanggalLahir = this._validateTanggalLahir(value);
    }

    // Validasi dengan Regex
    _validateNama(nama) {
        const regex = /^[A-Za-z\s]{3,50}$/;
        if (!regex.test(nama)) {
            throw new Error('Nama harus 3-50 karakter (hanya huruf dan spasi)');
        }
        return nama.trim();
    }

    _validateTanggalLahir(tanggal) {
        const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
        if (!regex.test(tanggal)) {
            throw new Error('Format tanggal lahir harus DD/MM/YYYY');
        }
        return tanggal;
    }

    // Polimorfisme: Method yang bisa di-override
    getInfo() {
        return `Nama: ${this._nama}, Lahir: ${this._tanggalLahir}`;
    }

    // Method statis untuk utility
    static calculateAge(tanggalLahir) {
        const [day, month, year] = tanggalLahir.split('/').map(Number);
        const today = new Date();
        let age = today.getFullYear() - year;
        const monthDiff = today.getMonth() + 1 - month;
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
            age--;
        }
        return age;
    }
}

/**
 * Kelas Mahasiswa yang mewarisi dari Person
 * Demonstrasi inheritance dan encapsulation
 */
class Mahasiswa extends Person {
    constructor(nim, nama, tanggalLahir, email, prodi, tahunMasuk, alamat = '') {
        super(nama, tanggalLahir); // Call parent constructor
        this._nim = this._validateNIM(nim);
        this._email = this._validateEmail(email);
        this._prodi = prodi;
        this._tahunMasuk = this._validateTahunMasuk(tahunMasuk);
        this._alamat = alamat;
        this._createdAt = new Date();
    }

    // Getter dan Setter dengan validasi
    get nim() {
        return this._nim;
    }

    set nim(value) {
        this._nim = this._validateNIM(value);
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = this._validateEmail(value);
    }

    get prodi() {
        return this._prodi;
    }

    set prodi(value) {
        this._prodi = value;
    }

    get tahunMasuk() {
        return this._tahunMasuk;
    }

    set tahunMasuk(value) {
        this._tahunMasuk = this._validateTahunMasuk(value);
    }

    get alamat() {
        return this._alamat;
    }

    set alamat(value) {
        this._alamat = value;
    }

    get createdAt() {
        return this._createdAt;
    }

    // Validasi dengan Regex
    _validateNIM(nim) {
        const regex = /^\d{10,15}$/;
        if (!regex.test(nim)) {
            throw new Error('NIM harus 10-15 digit angka');
        }
        return nim;
    }

    _validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            throw new Error('Format email tidak valid');
        }
        return email;
    }

    _validateTahunMasuk(tahun) {
        const regex = /^(19|20)\d{2}$/;
        if (!regex.test(tahun)) {
            throw new Error('Tahun masuk harus antara 1900-2099');
        }
        return tahun;
    }

    // Override method dari parent class (polymorphism)
    getInfo() {
        return `${super.getInfo()}, NIM: ${this._nim}, Prodi: ${this._prodi}`;
    }

    // Method untuk mendapatkan data dalam bentuk object
    toObject() {
        return {
            nim: this._nim,
            nama: this._nama,
            tanggalLahir: this._tanggalLahir,
            email: this._email,
            prodi: this._prodi,
            tahunMasuk: this._tahunMasuk,
            alamat: this._alamat,
            usia: Person.calculateAge(this._tanggalLahir),
            createdAt: this._createdAt
        };
    }
}

/**
 * Kelas khusus untuk Mahasiswa Internasional
 * Demonstrasi inheritance tambahan
 */
class MahasiswaInternasional extends Mahasiswa {
    constructor(nim, nama, tanggalLahir, email, prodi, tahunMasuk, negaraAsal, visaNumber) {
        super(nim, nama, tanggalLahir, email, prodi, tahunMasuk);
        this._negaraAsal = negaraAsal;
        this._visaNumber = visaNumber;
    }

    get negaraAsal() {
        return this._negaraAsal;
    }

    get visaNumber() {
        return this._visaNumber;
    }

    // Override method untuk menambahkan informasi internasional
    getInfo() {
        return `${super.getInfo()}, Negara Asal: ${this._negaraAsal}`;
    }

    toObject() {
        const baseObj = super.toObject();
        return {
            ...baseObj,
            negaraAsal: this._negaraAsal,
            visaNumber: this._visaNumber,
            jenis: 'Internasional'
        };
    }
}

// ============================================
// DATA MANAGEMENT SYSTEM
// ============================================

class DataManager {
    constructor() {
        this.mahasiswaArray = []; // Array untuk menyimpan data
        this.currentIndex = -1; // Index untuk operasi edit
        this.currentPage = 1;
        this.pageSize = 10;
        this.sortState = { field: 'nim', ascending: true };
    }

    // CRUD Operations
    addMahasiswa(mahasiswa) {
        // Time Complexity: O(1) untuk push
        this.mahasiswaArray.push(mahasiswa);
        this._updateStats();
        return this.mahasiswaArray.length - 1;
    }

    updateMahasiswa(index, mahasiswa) {
        // Time Complexity: O(1) - direct access
        if (index >= 0 && index < this.mahasiswaArray.length) {
            this.mahasiswaArray[index] = mahasiswa;
            return true;
        }
        return false;
    }

    deleteMahasiswa(index) {
        // Time Complexity: O(n) karena splice shifting
        if (index >= 0 && index < this.mahasiswaArray.length) {
            this.mahasiswaArray.splice(index, 1);
            this._updateStats();
            return true;
        }
        return false;
    }

    getMahasiswa(index) {
        // Time Complexity: O(1)
        if (index >= 0 && index < this.mahasiswaArray.length) {
            return this.mahasiswaArray[index];
        }
        return null;
    }

    getAllMahasiswa() {
        // Time Complexity: O(1) - returning reference
        return this.mahasiswaArray;
    }

    getPaginatedData(page = 1) {
        // Time Complexity: O(1) untuk slicing
        const start = (page - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.mahasiswaArray.slice(start, end);
    }

    // File I/O Operations
    async exportToJSON(filename = 'mahasiswa_data.json') {
        try {
            const data = this.mahasiswaArray.map(m => m.toObject());
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('Export error:', error);
            throw error;
        }
    }

    async importFromJSON(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (!Array.isArray(data)) {
                throw new Error('Format file tidak valid');
            }

            this.mahasiswaArray = data.map(item => {
                try {
                    if (item.negaraAsal) {
                        return new MahasiswaInternasional(
                            item.nim,
                            item.nama,
                            item.tanggalLahir,
                            item.email,
                            item.prodi,
                            item.tahunMasuk,
                            item.negaraAsal,
                            item.visaNumber || ''
                        );
                    } else {
                        return new Mahasiswa(
                            item.nim,
                            item.nama,
                            item.tanggalLahir,
                            item.email,
                            item.prodi,
                            item.tahunMasuk,
                            item.alamat || ''
                        );
                    }
                } catch (error) {
                    console.warn('Data tidak valid:', item, error);
                    return null;
                }
            }).filter(m => m !== null);

            this._updateStats();
            return this.mahasiswaArray.length;
        } catch (error) {
            console.error('Import error:', error);
            throw error;
        }
    }

    // SEARCHING ALGORITHMS
    linearSearch(query, field = 'all') {
        /**
         * Linear Search Algorithm
         * Time Complexity: O(n) - Worst case
         * Best case: O(1) jika ditemukan di awal
         */
        const results = [];
        const queryLower = query.toLowerCase();
        
        for (let i = 0; i < this.mahasiswaArray.length; i++) {
            const mahasiswa = this.mahasiswaArray[i];
            const obj = mahasiswa.toObject();
            
            if (field === 'all') {
                // Search in all fields
                if (Object.values(obj).some(value => 
                    String(value).toLowerCase().includes(queryLower))) {
                    results.push({ index: i, data: mahasiswa });
                }
            } else if (obj[field] && String(obj[field]).toLowerCase().includes(queryLower)) {
                results.push({ index: i, data: mahasiswa });
            }
        }
        
        return results;
    }

    binarySearch(nim) {
        /**
         * Binary Search Algorithm
         * Time Complexity: O(log n)
         * Prerequisite: Data harus terurut berdasarkan NIM
         */
        const sortedArray = [...this.mahasiswaArray].sort((a, b) => 
            a.nim.localeCompare(b.nim));
        
        let left = 0;
        let right = sortedArray.length - 1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const currentNIM = sortedArray[mid].nim;
            
            if (currentNIM === nim) {
                // Cari index asli di array original
                const originalIndex = this.mahasiswaArray.findIndex(m => m.nim === nim);
                return { index: originalIndex, data: sortedArray[mid] };
            } else if (currentNIM < nim) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return null;
    }

    sequentialSearch(query, field) {
        /**
         * Sequential Search Algorithm
         * Time Complexity: O(n)
         * Returns all matches sequentially
         */
        const results = [];
        const queryLower = query.toLowerCase();
        
        for (let i = 0; i < this.mahasiswaArray.length; i++) {
            const mahasiswa = this.mahasiswaArray[i];
            const value = String(mahasiswa[field] || '').toLowerCase();
            
            if (value.includes(queryLower)) {
                results.push({ index: i, data: mahasiswa });
            }
        }
        
        return results;
    }

    // SORTING ALGORITHMS
    bubbleSort(field = 'nim', ascending = true) {
        /**
         * Bubble Sort Algorithm
         * Time Complexity: O(n²) - Worst case
         * Best case: O(n) jika sudah terurut
         */
        const arr = [...this.mahasiswaArray];
        const n = arr.length;
        let swapped;
        
        do {
            swapped = false;
            for (let i = 0; i < n - 1; i++) {
                const a = arr[i][field];
                const b = arr[i + 1][field];
                const shouldSwap = ascending ? a > b : a < b;
                
                if (shouldSwap) {
                    // Swap elements
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                    swapped = true;
                }
            }
        } while (swapped);
        
        return arr;
    }

    insertionSort(field = 'nim', ascending = true) {
        /**
         * Insertion Sort Algorithm
         * Time Complexity: O(n²) - Worst case
         * Best case: O(n) jika sudah terurut
         */
        const arr = [...this.mahasiswaArray];
        
        for (let i = 1; i < arr.length; i++) {
            const current = arr[i];
            let j = i - 1;
            
            while (j >= 0 && this._compare(arr[j][field], current[field], ascending)) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = current;
        }
        
        return arr;
    }

    selectionSort(field = 'nim', ascending = true) {
        /**
         * Selection Sort Algorithm
         * Time Complexity: O(n²)
         */
        const arr = [...this.mahasiswaArray];
        const n = arr.length;
        
        for (let i = 0; i < n - 1; i++) {
            let extremeIndex = i;
            
            for (let j = i + 1; j < n; j++) {
                if (this._compare(arr[extremeIndex][field], arr[j][field], ascending)) {
                    extremeIndex = j;
                }
            }
            
            if (extremeIndex !== i) {
                [arr[i], arr[extremeIndex]] = [arr[extremeIndex], arr[i]];
            }
        }
        
        return arr;
    }

    mergeSort(field = 'nim', ascending = true) {
        /**
         * Merge Sort Algorithm
         * Time Complexity: O(n log n)
         */
        const arr = [...this.mahasiswaArray];
        
        function mergeSortRecursive(array) {
            if (array.length <= 1) {
                return array;
            }
            
            const mid = Math.floor(array.length / 2);
            const left = mergeSortRecursive(array.slice(0, mid));
            const right = mergeSortRecursive(array.slice(mid));
            
            return merge(left, right);
        }
        
        function merge(left, right) {
            const result = [];
            let i = 0, j = 0;
            
            while (i < left.length && j < right.length) {
                const compareResult = ascending ? 
                    left[i][field] <= right[j][field] :
                    left[i][field] >= right[j][field];
                
                if (compareResult) {
                    result.push(left[i]);
                    i++;
                } else {
                    result.push(right[j]);
                    j++;
                }
            }
            
            return result.concat(left.slice(i)).concat(right.slice(j));
        }
        
        return mergeSortRecursive(arr);
    }

    shellSort(field = 'nim', ascending = true) {
        /**
         * Shell Sort Algorithm
         * Time Complexity: O(n log² n) atau O(n^(3/2))
         */
        const arr = [...this.mahasiswaArray];
        const n = arr.length;
        
        for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
            for (let i = gap; i < n; i++) {
                const temp = arr[i];
                let j;
                
                for (j = i; j >= gap && this._compare(arr[j - gap][field], temp[field], ascending); j -= gap) {
                    arr[j] = arr[j - gap];
                }
                
                arr[j] = temp;
            }
        }
        
        return arr;
    }

    // Helper function untuk comparison
    _compare(a, b, ascending) {
        if (typeof a === 'string' && typeof b === 'string') {
            return ascending ? a > b : a < b;
        }
        return ascending ? a > b : a < b;
    }

    // Statistics
    _updateStats() {
        const total = this.mahasiswaArray.length;
        const prodiSet = new Set(this.mahasiswaArray.map(m => m.prodi));
        const avgYear = this.mahasiswaArray.length > 0 ?
            Math.round(this.mahasiswaArray.reduce((sum, m) => sum + parseInt(m.tahunMasuk), 0) / total) :
            2024;
        
        // Update UI elements if they exist
        if (document.getElementById('totalStudents')) {
            document.getElementById('totalStudents').textContent = total;
        }
        if (document.getElementById('totalProdi')) {
            document.getElementById('totalProdi').textContent = prodiSet.size;
        }
        if (document.getElementById('avgYear')) {
            document.getElementById('avgYear').textContent = avgYear;
        }
    }

    // Get total pages
    getTotalPages() {
        return Math.ceil(this.mahasiswaArray.length / this.pageSize);
    }
}

// ============================================
// UI CONTROLLER
// ============================================

class UIController {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.isEditing = false;
        this.currentEditIndex = -1;
        this.currentSearchResults = [];
        this.currentSortAlgorithm = 'bubble';
        this.currentSearchAlgorithm = 'linear';
        
        this.initializeEventListeners();
        this.loadSampleData();
        this.updateTable();
    }

    initializeEventListeners() {
        // Form submission
        document.getElementById('mahasiswaForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetForm();
        });

        // Update button
        document.getElementById('updateBtn').addEventListener('click', () => {
            this.handleUpdate();
        });

        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.cancelEdit();
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.handleExport();
        });

        // Import button
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        // File input change
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleImport(e.target.files[0]);
        });

        // Search input
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Search type change
        document.getElementById('searchType').addEventListener('change', () => {
            this.handleSearch(document.getElementById('searchInput').value);
        });

        // Search algorithm change
        document.getElementById('searchAlgorithm').addEventListener('change', (e) => {
            this.currentSearchAlgorithm = e.target.value;
            this.handleSearch(document.getElementById('searchInput').value);
        });

        // Sort field change
        document.getElementById('sortField').addEventListener('change', (e) => {
            this.dataManager.sortState.field = e.target.value;
            this.handleSort();
        });

        // Sort algorithm change
        document.getElementById('sortAlgorithm').addEventListener('change', (e) => {
            this.currentSortAlgorithm = e.target.value;
            this.handleSort();
        });

        // Sort buttons
        document.getElementById('sortAscBtn').addEventListener('click', () => {
            this.dataManager.sortState.ascending = true;
            this.handleSort();
        });

        document.getElementById('sortDescBtn').addEventListener('click', () => {
            this.dataManager.sortState.ascending = false;
            this.handleSort();
        });

        // Pagination
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.prevPage();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextPage();
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Modal close
        document.querySelector('.close-modal').addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('modalOkBtn').addEventListener('click', () => {
            this.hideModal();
        });
    }

    handleFormSubmit() {
        try {
            // Collect form data
            const formData = {
                nim: document.getElementById('nim').value.trim(),
                nama: document.getElementById('nama').value.trim(),
                tanggalLahir: document.getElementById('tanggalLahir').value.trim(),
                email: document.getElementById('email').value.trim(),
                prodi: document.getElementById('prodi').value,
                tahunMasuk: document.getElementById('tahunMasuk').value.trim(),
                alamat: document.getElementById('alamat').value.trim()
            };

            // Clear previous errors
            this.clearErrors();

            // Validate all fields
            this.validateField('nim', formData.nim, /^\d{10,15}$/, 'NIM harus 10-15 digit angka');
            this.validateField('nama', formData.nama, /^[A-Za-z\s]{3,50}$/, 'Nama harus 3-50 karakter (hanya huruf dan spasi)');
            this.validateField('tanggalLahir', formData.tanggalLahir, /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/, 'Format tanggal lahir harus DD/MM/YYYY');
            this.validateField('email', formData.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Format email tidak valid');
            this.validateField('tahunMasuk', formData.tahunMasuk, /^(19|20)\d{2}$/, 'Tahun masuk harus antara 1900-2099');

            // Check if any errors
            const errors = document.querySelectorAll('.error-message:not(:empty)');
            if (errors.length > 0) {
                throw new Error('Terdapat kesalahan validasi. Periksa form Anda.');
            }

            // Check for duplicate NIM
            if (!this.isEditing) {
                const isDuplicate = this.dataManager.getAllMahasiswa().some(m => m.nim === formData.nim);
                if (isDuplicate) {
                    throw new Error(`NIM ${formData.nim} sudah terdaftar`);
                }
            }

            // Create Mahasiswa object
            let mahasiswa;
            
            // Contoh polimorfisme: Mahasiswa Internasional jika email mengandung domain tertentu
            if (formData.email.includes('.int.')) {
                mahasiswa = new MahasiswaInternasional(
                    formData.nim,
                    formData.nama,
                    formData.tanggalLahir,
                    formData.email,
                    formData.prodi,
                    formData.tahunMasuk,
                    'International', // Default country
                    `VISA${formData.nim.slice(-6)}`
                );
            } else {
                mahasiswa = new Mahasiswa(
                    formData.nim,
                    formData.nama,
                    formData.tanggalLahir,
                    formData.email,
                    formData.prodi,
                    formData.tahunMasuk,
                    formData.alamat
                );
            }

            // Add or update data
            if (this.isEditing && this.currentEditIndex >= 0) {
                this.dataManager.updateMahasiswa(this.currentEditIndex, mahasiswa);
                this.showMessage('Data berhasil diperbarui!', 'success');
            } else {
                this.dataManager.addMahasiswa(mahasiswa);
                this.showMessage('Data berhasil disimpan!', 'success');
            }

            // Reset form and update table
            this.resetForm();
            this.updateTable();

        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage(`Error: ${error.message}`, 'error');
        }
    }

    handleUpdate() {
        this.handleFormSubmit();
    }

    cancelEdit() {
        this.isEditing = false;
        this.currentEditIndex = -1;
        this.resetForm();
        
        // Show/hide buttons
        document.getElementById('saveBtn').style.display = 'inline-flex';
        document.getElementById('updateBtn').style.display = 'none';
        document.getElementById('cancelBtn').style.display = 'none';
    }

    editMahasiswa(index) {
        try {
            const mahasiswa = this.dataManager.getMahasiswa(index);
            if (!mahasiswa) {
                throw new Error('Data tidak ditemukan');
            }

            this.isEditing = true;
            this.currentEditIndex = index;

            // Fill form
            document.getElementById('nim').value = mahasiswa.nim;
            document.getElementById('nama').value = mahasiswa.nama;
            document.getElementById('tanggalLahir').value = mahasiswa.tanggalLahir;
            document.getElementById('email').value = mahasiswa.email;
            document.getElementById('prodi').value = mahasiswa.prodi;
            document.getElementById('tahunMasuk').value = mahasiswa.tahunMasuk;
            document.getElementById('alamat').value = mahasiswa.alamat || '';

            // Disable NIM field during edit
            document.getElementById('nim').disabled = true;

            // Show/hide buttons
            document.getElementById('saveBtn').style.display = 'none';
            document.getElementById('updateBtn').style.display = 'inline-flex';
            document.getElementById('cancelBtn').style.display = 'inline-flex';

            // Scroll to form
            document.getElementById('mahasiswaForm').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            this.showMessage(`Error: ${error.message}`, 'error');
        }
    }

    deleteMahasiswa(index) {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            try {
                this.dataManager.deleteMahasiswa(index);
                this.updateTable();
                this.showMessage('Data berhasil dihapus!', 'success');
                
                // If deleting during edit, reset form
                if (this.isEditing && this.currentEditIndex === index) {
                    this.cancelEdit();
                }
            } catch (error) {
                this.showMessage(`Error: ${error.message}`, 'error');
            }
        }
    }

    handleSearch(query) {
        try {
            const searchType = document.getElementById('searchType').value;
            let results = [];
            let timeComplexity = '';
            let startTime = performance.now();

            // Choose search algorithm
            switch (this.currentSearchAlgorithm) {
                case 'linear':
                    results = this.dataManager.linearSearch(query, searchType);
                    timeComplexity = 'O(n) - Linear Search';
                    break;
                    
                case 'binary':
                    if (searchType === 'nim' && query) {
                        const result = this.dataManager.binarySearch(query);
                        results = result ? [{ index: result.index, data: result.data }] : [];
                    } else {
                        // Fallback to linear for non-NIM searches
                        results = this.dataManager.linearSearch(query, searchType);
                    }
                    timeComplexity = 'O(log n) - Binary Search';
                    break;
                    
                case 'sequential':
                    if (searchType !== 'all') {
                        results = this.dataManager.sequentialSearch(query, searchType);
                    } else {
                        results = this.dataManager.linearSearch(query, searchType);
                    }
                    timeComplexity = 'O(n) - Sequential Search';
                    break;
            }

            const endTime = performance.now();
            const executionTime = (endTime - startTime).toFixed(2);

            // Update search results
            this.currentSearchResults = results.map(r => r.index);
            
            // Update table with search results or all data
            if (query.trim() === '') {
                this.updateTable();
                document.getElementById('complexityInfo').textContent = '';
            } else {
                this.updateTable(results.map(r => r.data));
                document.getElementById('complexityInfo').textContent = 
                    `${timeComplexity} | ${executionTime}ms | ${results.length} hasil`;
            }

        } catch (error) {
            console.error('Search error:', error);
        }
    }

    handleSort() {
        try {
            const { field, ascending } = this.dataManager.sortState;
            let sortedData;
            let timeComplexity = '';
            let startTime = performance.now();

            // Choose sort algorithm
            switch (this.currentSortAlgorithm) {
                case 'bubble':
                    sortedData = this.dataManager.bubbleSort(field, ascending);
                    timeComplexity = 'O(n²) - Bubble Sort';
                    break;
                    
                case 'insertion':
                    sortedData = this.dataManager.insertionSort(field, ascending);
                    timeComplexity = 'O(n²) - Insertion Sort';
                    break;
                    
                case 'selection':
                    sortedData = this.dataManager.selectionSort(field, ascending);
                    timeComplexity = 'O(n²) - Selection Sort';
                    break;
                    
                case 'merge':
                    sortedData = this.dataManager.mergeSort(field, ascending);
                    timeComplexity = 'O(n log n) - Merge Sort';
                    break;
                    
                case 'shell':
                    sortedData = this.dataManager.shellSort(field, ascending);
                    timeComplexity = 'O(n log² n) - Shell Sort';
                    break;
            }

            const endTime = performance.now();
            const executionTime = (endTime - startTime).toFixed(2);

            // Temporarily replace data for display
            this.dataManager.mahasiswaArray = sortedData;
            this.updateTable();
            
            // Show complexity info
            document.getElementById('complexityInfo').textContent = 
                `${timeComplexity} | ${executionTime}ms | ${ascending ? 'Asc' : 'Desc'}`;

        } catch (error) {
            console.error('Sort error:', error);
            this.showMessage(`Error saat pengurutan: ${error.message}`, 'error');
        }
    }

    async handleExport() {
        try {
            this.showLoading(true);
            await this.dataManager.exportToJSON();
            this.showMessage('Data berhasil diekspor ke JSON!', 'success');
        } catch (error) {
            this.showMessage(`Error ekspor: ${error.message}`, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleImport(file) {
        if (!file) return;
        
        try {
            this.showLoading(true);
            const count = await this.dataManager.importFromJSON(file);
            this.updateTable();
            this.showMessage(`${count} data berhasil diimpor!`, 'success');
        } catch (error) {
            this.showMessage(`Error impor: ${error.message}`, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    updateTable(data = null) {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        const displayData = data || this.dataManager.getPaginatedData(this.dataManager.currentPage);
        
        displayData.forEach((mahasiswa, index) => {
            const row = document.createElement('tr');
            const obj = mahasiswa.toObject();
            const actualIndex = data ? 
                this.dataManager.mahasiswaArray.findIndex(m => m.nim === mahasiswa.nim) : 
                (this.dataManager.currentPage - 1) * this.dataManager.pageSize + index;

            row.innerHTML = `
                <td>${actualIndex + 1}</td>
                <td>${obj.nim}</td>
                <td>${obj.nama}</td>
                <td>${obj.email}</td>
                <td>${obj.prodi}</td>
                <td>${obj.usia} tahun</td>
                <td>${obj.tahunMasuk}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary" onclick="app.uiController.editMahasiswa(${actualIndex})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.uiController.deleteMahasiswa(${actualIndex})">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                </td>
            `;

            // Highlight search results
            if (this.currentSearchResults.includes(actualIndex)) {
                row.style.backgroundColor = 'rgba(76, 201, 240, 0.1)';
            }

            tableBody.appendChild(row);
        });

        // Update pagination info
        const totalPages = this.dataManager.getTotalPages();
        const pageInfo = document.getElementById('pageInfo');
        const rowCount = document.getElementById('rowCount');
        
        pageInfo.textContent = `Halaman ${this.dataManager.currentPage} dari ${totalPages}`;
        rowCount.textContent = data ? data.length : this.dataManager.mahasiswaArray.length;

        // Enable/disable pagination buttons
        document.getElementById('prevBtn').disabled = this.dataManager.currentPage <= 1;
        document.getElementById('nextBtn').disabled = this.dataManager.currentPage >= totalPages;
    }

    prevPage() {
        if (this.dataManager.currentPage > 1) {
            this.dataManager.currentPage--;
            this.updateTable();
        }
    }

    nextPage() {
        if (this.dataManager.currentPage < this.dataManager.getTotalPages()) {
            this.dataManager.currentPage++;
            this.updateTable();
        }
    }

    resetForm() {
        document.getElementById('mahasiswaForm').reset();
        document.getElementById('nim').disabled = false;
        this.clearErrors();
        
        // Reset edit mode
        this.isEditing = false;
        this.currentEditIndex = -1;
        
        // Show/hide buttons
        document.getElementById('saveBtn').style.display = 'inline-flex';
        document.getElementById('updateBtn').style.display = 'none';
        document.getElementById('cancelBtn').style.display = 'none';
    }

    validateField(fieldId, value, regex, errorMessage) {
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (!regex.test(value)) {
            errorElement.textContent = errorMessage;
            return false;
        } else {
            errorElement.textContent = '';
            return true;
        }
    }

    clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
    }

    showMessage(message, type = 'info') {
        const modal = document.getElementById('alertModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        
        // Set modal content based on type
        modalTitle.textContent = type === 'error' ? 'Error' : 
                                type === 'success' ? 'Sukses' : 'Informasi';
        modalMessage.textContent = message;
        
        // Set modal color based on type
        modal.querySelector('.modal-header').style.borderBottomColor = 
            type === 'error' ? 'var(--danger-color)' :
            type === 'success' ? 'var(--success-color)' : 'var(--primary-color)';
        
        modal.classList.add('show');
    }

    hideModal() {
        document.getElementById('alertModal').classList.remove('show');
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('show');
        } else {
            overlay.classList.remove('show');
        }
    }

    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        const icon = document.querySelector('#themeToggle i');
        
        document.body.setAttribute('data-theme', newTheme);
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        // Save preference to localStorage
        localStorage.setItem('theme', newTheme);
    }

    loadSampleData() {
        try {
            // Add sample data for demonstration
            const sampleData = [
                new Mahasiswa('20241010001', 'Ahmad Wijaya', '15/05/2002', 'ahmad@student.ac.id', 'Informatika', '2020', 'Jl. Merdeka No. 123'),
                new MahasiswaInternasional('20241010002', 'John Smith', '22/08/2001', 'john.smith@student.int.ac.id', 'Sistem Informasi', '2021', 'United States', 'VISA123456'),
                new Mahasiswa('20241010003', 'Siti Nurhaliza', '10/12/2003', 'siti@student.ac.id', 'Teknik Komputer', '2022', 'Jl. Sudirman No. 45'),
                new Mahasiswa('20241010004', 'Budi Santoso', '03/04/2000', 'budi@student.ac.id', 'Teknik Elektro', '2019', 'Jl. Gatot Subroto No. 67'),
                new Mahasiswa('20241010005', 'Rina Melati', '25/11/2002', 'rina@student.ac.id', 'Manajemen', '2021', 'Jl. Thamrin No. 89'),
                new Mahasiswa('20241010006', 'Dewi Anggraini', '18/07/2004', 'dewi@student.ac.id', 'Akuntansi', '2023', 'Jl. Asia Afrika No. 12'),
                new Mahasiswa('20241010007', 'Eko Prasetyo', '30/01/2001', 'eko@student.ac.id', 'Informatika', '2020', 'Jl. Diponegoro No. 34'),
                new MahasiswaInternasional('20241010008', 'Maria Garcia', '14/09/2003', 'maria.garcia@student.int.ac.id', 'Sistem Informasi', '2022', 'Spain', 'VISA789012'),
                new Mahasiswa('20241010009', 'Fajar Ramadan', '05/06/2002', 'fajar@student.ac.id', 'Teknik Komputer', '2021', 'Jl. Pahlawan No. 56'),
                new Mahasiswa('20241010010', 'Gita Permata', '12/03/2000', 'gita@student.ac.id', 'Teknik Elektro', '2019', 'Jl. Hayam Wuruk No. 78')
            ];

            sampleData.forEach(data => {
                this.dataManager.addMahasiswa(data);
            });

            this.updateTable();

        } catch (error) {
            console.error('Error loading sample data:', error);
        }
    }
}

// ============================================
// APPLICATION INITIALIZATION
// ============================================

// Global application object
window.app = {
    dataManager: null,
    uiController: null,
    
    init() {
        try {
            // Initialize Data Manager
            this.dataManager = new DataManager();
            
            // Initialize UI Controller
            this.uiController = new UIController(this.dataManager);
            
            // Load saved theme
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.body.setAttribute('data-theme', savedTheme);
            
            const icon = document.querySelector('#themeToggle i');
            icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            
            console.log('Aplikasi Manajemen Data Mahasiswa berhasil diinisialisasi!');
            console.log('Fitur yang tersedia:');
            console.log('- OOP: Class, Inheritance, Encapsulation, Polymorphism');
            console.log('- CRUD Operations dengan Array');
            console.log('- File I/O: Import/Export JSON');
            console.log('- Searching: Linear, Binary, Sequential');
            console.log('- Sorting: Bubble, Insertion, Selection, Merge, Shell');
            console.log('- Regex Validation dan Error Handling');
            
        } catch (error) {
            console.error('Error initializing application:', error);
            alert('Terjadi kesalahan saat menginisialisasi aplikasi. Lihat console untuk detail.');
        }
    }
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Expose UI controller methods for inline onclick handlers
window.app.uiController = null; // Will be set by app.init()