/**
 * APLIKASI MANAJEMEN DATA MAHASISWA - VERSION 3.0
 * File: script.js
 * Fitur Lengkap: OOP, CRUD, Searching, Sorting, File I/O, Real-time, Algorithm Visualization
 */

// ============================================
// KELAS DASAR - OOP IMPLEMENTATION
// ============================================

class Person {
    constructor(nama, tanggalLahir) {
        this._nama = this._validateNama(nama);
        this._tanggalLahir = this._validateTanggalLahir(tanggalLahir);
        this._usia = this._hitungUsia();
    }

    get nama() {
        return this._nama;
    }

    set nama(value) {
        this._nama = this._validateNama(value);
        this._usia = this._hitungUsia();
    }

    get tanggalLahir() {
        return this._tanggalLahir;
    }

    set tanggalLahir(value) {
        this._tanggalLahir = this._validateTanggalLahir(value);
        this._usia = this._hitungUsia();
    }

    get usia() {
        return this._usia;
    }

    _validateNama(nama) {
        const namaTrimmed = nama.trim();
        if (namaTrimmed.length < 3 || namaTrimmed.length > 50) {
            throw new Error('Nama harus 3-50 karakter');
        }
        const regex = /^[A-Za-z\s]+$/;
        if (!regex.test(namaTrimmed)) {
            throw new Error('Nama hanya boleh mengandung huruf dan spasi');
        }
        return namaTrimmed;
    }

    _validateTanggalLahir(tanggal) {
        let dateObj;
        
        if (tanggal.includes('-')) {
            dateObj = new Date(tanggal);
        } else if (tanggal.includes('/')) {
            const [day, month, year] = tanggal.split('/').map(Number);
            dateObj = new Date(year, month - 1, day);
        } else {
            throw new Error('Format tanggal tidak valid');
        }

        if (isNaN(dateObj.getTime())) {
            throw new Error('Tanggal lahir tidak valid');
        }

        if (dateObj > new Date()) {
            throw new Error('Tanggal lahir tidak boleh di masa depan');
        }

        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 17);
        if (dateObj > minDate) {
            throw new Error('Usia minimal 17 tahun');
        }

        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        
        return `${day}/${month}/${year}`;
    }

    _hitungUsia() {
        try {
            const [day, month, year] = this._tanggalLahir.split('/').map(Number);
            const birthDate = new Date(year, month - 1, day);
            const today = new Date();
            
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            return age;
        } catch (error) {
            return 0;
        }
    }

    getInfo() {
        return `Nama: ${this._nama}, Lahir: ${this._tanggalLahir}, Usia: ${this._usia}`;
    }
}

class Mahasiswa extends Person {
    constructor(nim, nama, tanggalLahir, email, prodi, tahunMasuk, alamat = '') {
        super(nama, tanggalLahir);
        this._nim = this._validateNIM(nim);
        this._email = this._validateEmail(email);
        this._prodi = prodi;
        this._tahunMasuk = this._validateTahunMasuk(tahunMasuk);
        this._alamat = alamat;
        this._createdAt = new Date();
        this._lastUpdated = new Date();
    }

    get nim() { return this._nim; }
    set nim(value) { 
        this._nim = this._validateNIM(value);
        this._lastUpdated = new Date();
    }
    
    get email() { return this._email; }
    set email(value) { 
        this._email = this._validateEmail(value);
        this._lastUpdated = new Date();
    }
    
    get prodi() { return this._prodi; }
    set prodi(value) { 
        this._prodi = value;
        this._lastUpdated = new Date();
    }
    
    get tahunMasuk() { return this._tahunMasuk; }
    set tahunMasuk(value) { 
        this._tahunMasuk = this._validateTahunMasuk(value);
        this._lastUpdated = new Date();
    }
    
    get alamat() { return this._alamat; }
    set alamat(value) { 
        this._alamat = value;
        this._lastUpdated = new Date();
    }
    
    get createdAt() { return this._createdAt; }
    get lastUpdated() { return this._lastUpdated; }

    _validateNIM(nim) {
        const nimTrimmed = String(nim).trim();
        const regex = /^\d{10,15}$/;
        if (!regex.test(nimTrimmed)) {
            throw new Error('NIM harus 10-15 digit angka');
        }
        return nimTrimmed;
    }

    _validateEmail(email) {
        const emailTrimmed = email.trim().toLowerCase();
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(emailTrimmed)) {
            throw new Error('Format email tidak valid');
        }
        
        return emailTrimmed;
    }

    _validateTahunMasuk(tahun) {
        const tahunNum = parseInt(tahun);
        if (isNaN(tahunNum)) {
            throw new Error('Tahun harus angka');
        }
        
        const currentYear = new Date().getFullYear();
        if (tahunNum < 2000 || tahunNum > currentYear + 1) {
            throw new Error(`Tahun masuk harus antara 2000-${currentYear + 1}`);
        }
        
        return tahunNum;
    }

    getInfo() {
        return `${super.getInfo()}, NIM: ${this._nim}, Prodi: ${this._prodi}`;
    }

    toObject() {
        return {
            nim: this._nim,
            nama: this._nama,
            tanggalLahir: this._tanggalLahir,
            email: this._email,
            prodi: this._prodi,
            tahunMasuk: this._tahunMasuk,
            alamat: this._alamat,
            usia: this._usia,
            createdAt: this._createdAt,
            lastUpdated: this._lastUpdated
        };
    }

    toDisplay() {
        return {
            nim: this._nim,
            nama: this._nama,
            email: this._email,
            prodi: this._prodi,
            usia: `${this._usia} tahun`,
            tahunMasuk: this._tahunMasuk,
            alamat: this._alamat || '-'
        };
    }
}

class MahasiswaInternasional extends Mahasiswa {
    constructor(nim, nama, tanggalLahir, email, prodi, tahunMasuk, negaraAsal, visaNumber) {
        super(nim, nama, tanggalLahir, email, prodi, tahunMasuk);
        this._negaraAsal = negaraAsal;
        this._visaNumber = visaNumber;
    }

    get negaraAsal() { return this._negaraAsal; }
    get visaNumber() { return this._visaNumber; }

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
// DATA MANAGER - CRUD & ALGORITHMS
// ============================================

class DataManager {
    constructor() {
        this.mahasiswaArray = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.sortState = { field: 'nim', ascending: true };
        this.searchResults = null;
        this.comparisonCount = 0;
        this.swapCount = 0;
        this.operationCount = 0;
        this.lastUpdateTime = new Date();
    }

    addMahasiswa(mahasiswa) {
        this.mahasiswaArray.push(mahasiswa);
        this._updateStats();
        this._updateLastUpdate();
        return this.mahasiswaArray.length - 1;
    }

    updateMahasiswa(index, mahasiswa) {
        if (index >= 0 && index < this.mahasiswaArray.length) {
            this.mahasiswaArray[index] = mahasiswa;
            this._updateLastUpdate();
            return true;
        }
        return false;
    }

    deleteMahasiswa(index) {
        if (index >= 0 && index < this.mahasiswaArray.length) {
            this.mahasiswaArray.splice(index, 1);
            this._updateStats();
            this._updateLastUpdate();
            return true;
        }
        return false;
    }

    getMahasiswa(index) {
        if (index >= 0 && index < this.mahasiswaArray.length) {
            return this.mahasiswaArray[index];
        }
        return null;
    }

    getMahasiswaByNIM(nim) {
        return this.mahasiswaArray.find(m => m.nim === nim);
    }

    getAllMahasiswa() {
        return this.mahasiswaArray;
    }

    getPaginatedData(page = 1) {
        const data = this.searchResults || this.mahasiswaArray;
        const start = (page - 1) * this.pageSize;
        const end = start + this.pageSize;
        return data.slice(start, end);
    }

    getTotalPages() {
        const data = this.searchResults || this.mahasiswaArray;
        return Math.max(1, Math.ceil(data.length / this.pageSize));
    }

    linearSearch(query, field = 'all') {
        this.comparisonCount = 0;
        const results = [];
        const queryLower = query.toLowerCase().trim();
        
        if (!queryLower) return results;
        
        for (let i = 0; i < this.mahasiswaArray.length; i++) {
            const mahasiswa = this.mahasiswaArray[i];
            const obj = mahasiswa.toObject();
            
            if (field === 'all') {
                let found = false;
                for (const key in obj) {
                    this.comparisonCount++;
                    if (String(obj[key]).toLowerCase().includes(queryLower)) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    results.push({ index: i, data: mahasiswa });
                }
            } else if (obj[field]) {
                this.comparisonCount++;
                if (String(obj[field]).toLowerCase().includes(queryLower)) {
                    results.push({ index: i, data: mahasiswa });
                }
            }
        }
        
        return results;
    }

    binarySearch(query, field = 'nim') {
        this.comparisonCount = 0;
        
        if (field !== 'nim') {
            return this.linearSearch(query, field);
        }
        
        const sortedArray = [...this.mahasiswaArray].sort((a, b) => 
            a.nim.localeCompare(b.nim));
        
        let left = 0;
        let right = sortedArray.length - 1;
        
        while (left <= right) {
            this.comparisonCount++;
            const mid = Math.floor((left + right) / 2);
            const currentNIM = sortedArray[mid].nim;
            
            if (currentNIM === query) {
                const originalIndex = this.mahasiswaArray.findIndex(m => m.nim === query);
                return [{ index: originalIndex, data: sortedArray[mid] }];
            } else if (currentNIM < query) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return [];
    }

    sequentialSearch(query, field = 'all') {
        this.comparisonCount = 0;
        const results = [];
        const queryLower = query.toLowerCase().trim();
        
        if (!queryLower) return results;
        
        for (let i = 0; i < this.mahasiswaArray.length; i++) {
            const mahasiswa = this.mahasiswaArray[i];
            
            if (field === 'all') {
                const obj = mahasiswa.toObject();
                for (const key in obj) {
                    this.comparisonCount++;
                    if (String(obj[key]).toLowerCase().includes(queryLower)) {
                        results.push({ index: i, data: mahasiswa });
                        break;
                    }
                }
            } else {
                this.comparisonCount++;
                const value = mahasiswa[field];
                if (value && String(value).toLowerCase().includes(queryLower)) {
                    results.push({ index: i, data: mahasiswa });
                }
            }
        }
        
        return results;
    }

    bubbleSort(field = 'nim', ascending = true) {
        this.comparisonCount = 0;
        this.swapCount = 0;
        const arr = [...this.mahasiswaArray];
        const n = arr.length;
        let swapped;
        
        do {
            swapped = false;
            for (let i = 0; i < n - 1; i++) {
                this.comparisonCount++;
                const a = this._getValue(arr[i], field);
                const b = this._getValue(arr[i + 1], field);
                const shouldSwap = ascending ? a > b : a < b;
                
                if (shouldSwap) {
                    this.swapCount++;
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                    swapped = true;
                }
            }
        } while (swapped);
        
        return arr;
    }

    insertionSort(field = 'nim', ascending = true) {
        this.comparisonCount = 0;
        this.swapCount = 0;
        const arr = [...this.mahasiswaArray];
        
        for (let i = 1; i < arr.length; i++) {
            const current = arr[i];
            let j = i - 1;
            
            while (j >= 0 && this._compare(arr[j][field], current[field], ascending)) {
                this.comparisonCount++;
                this.swapCount++;
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = current;
        }
        
        return arr;
    }

    selectionSort(field = 'nim', ascending = true) {
        this.comparisonCount = 0;
        this.swapCount = 0;
        const arr = [...this.mahasiswaArray];
        const n = arr.length;
        
        for (let i = 0; i < n - 1; i++) {
            let extremeIndex = i;
            
            for (let j = i + 1; j < n; j++) {
                this.comparisonCount++;
                if (this._compare(arr[extremeIndex][field], arr[j][field], ascending)) {
                    extremeIndex = j;
                }
            }
            
            if (extremeIndex !== i) {
                this.swapCount++;
                [arr[i], arr[extremeIndex]] = [arr[extremeIndex], arr[i]];
            }
        }
        
        return arr;
    }

    mergeSort(field = 'nim', ascending = true) {
        this.comparisonCount = 0;
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
        
        const merge = (left, right) => {
            const result = [];
            let i = 0, j = 0;
            
            while (i < left.length && j < right.length) {
                this.comparisonCount++;
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
        this.comparisonCount = 0;
        this.swapCount = 0;
        const arr = [...this.mahasiswaArray];
        const n = arr.length;
        
        for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
            for (let i = gap; i < n; i++) {
                const temp = arr[i];
                let j;
                
                for (j = i; j >= gap && this._compare(arr[j - gap][field], temp[field], ascending); j -= gap) {
                    this.comparisonCount++;
                    this.swapCount++;
                    arr[j] = arr[j - gap];
                }
                
                arr[j] = temp;
            }
        }
        
        return arr;
    }

    _getValue(obj, field) {
        if (field === 'usia') {
            return obj.usia;
        }
        return obj[field];
    }

    _compare(a, b, ascending) {
        if (typeof a === 'string' && typeof b === 'string') {
            return ascending ? a > b : a < b;
        }
        return ascending ? a > b : a < b;
    }

    _updateStats() {
        const total = this.mahasiswaArray.length;
        const prodiSet = new Set(this.mahasiswaArray.map(m => m.prodi));
        
        let avgYear = '-';
        if (total > 0) {
            const sum = this.mahasiswaArray.reduce((acc, m) => acc + parseInt(m.tahunMasuk), 0);
            avgYear = Math.round(sum / total);
        }
        
        this._updateUIStats(total, prodiSet.size, avgYear);
    }

    _updateUIStats(total, prodiCount, avgYear) {
        const totalElement = document.getElementById('totalStudents');
        const prodiElement = document.getElementById('totalProdi');
        const avgYearElement = document.getElementById('avgYear');
        const dataCounter = document.getElementById('dataCounter');
        
        if (totalElement) totalElement.textContent = total;
        if (prodiElement) prodiElement.textContent = prodiCount;
        if (avgYearElement) avgYearElement.textContent = avgYear;
        if (dataCounter) dataCounter.textContent = `${total} data`;
    }

    _updateLastUpdate() {
        this.lastUpdateTime = new Date();
        const lastUpdateElement = document.getElementById('lastUpdate');
        const lastUpdateDetail = document.getElementById('lastUpdateDetail');
        
        if (lastUpdateElement) {
            const now = new Date();
            const diffMs = now - this.lastUpdateTime;
            const diffSec = Math.floor(diffMs / 1000);
            
            let timeText;
            if (diffSec < 60) {
                timeText = 'Baru Saja';
            } else if (diffSec < 3600) {
                const minutes = Math.floor(diffSec / 60);
                timeText = `${minutes}m lalu`;
            } else if (diffSec < 86400) {
                const hours = Math.floor(diffSec / 3600);
                timeText = `${hours}j lalu`;
            } else {
                timeText = this.lastUpdateTime.toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short'
                });
            }
            
            lastUpdateElement.textContent = timeText;
        }
        
        if (lastUpdateDetail) {
            const now = new Date();
            const dateStr = now.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const timeStr = now.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            lastUpdateDetail.textContent = `${dateStr} ${timeStr}`;
        }
        
        if (this.onDataChange) {
            this.onDataChange();
        }
    }

    clearSearch() {
        this.searchResults = null;
        this.comparisonCount = 0;
        this.swapCount = 0;
        this.operationCount = 0;
    }

    getAlgorithmStats() {
        return {
            comparisons: this.comparisonCount,
            swaps: this.swapCount,
            operations: this.comparisonCount + this.swapCount
        };
    }

    async exportData(format = 'json', filename = 'mahasiswa_data') {
        try {
            const data = this.mahasiswaArray.map(m => m.toObject());
            let content, mimeType, extension;
            
            switch (format) {
                case 'json':
                    content = JSON.stringify(data, null, 2);
                    mimeType = 'application/json';
                    extension = 'json';
                    break;
                    
                case 'csv':
                    content = this.convertToCSV(data);
                    mimeType = 'text/csv';
                    extension = 'csv';
                    break;
                    
                case 'txt':
                    content = this.convertToTXT(data);
                    mimeType = 'text/plain';
                    extension = 'txt';
                    break;
                    
                case 'xml':
                    content = this.convertToXML(data);
                    mimeType = 'application/xml';
                    extension = 'xml';
                    break;
                    
                case 'excel':
                    if (typeof XLSX !== 'undefined') {
                        return await this.exportToExcel(data, filename);
                    } else {
                        throw new Error('Excel export requires SheetJS library');
                    }
                    
                default:
                    throw new Error(`Format ${format} tidak didukung`);
            }
            
            this.downloadFile(content, `${filename}.${extension}`, mimeType);
            return true;
            
        } catch (error) {
            console.error('Export error:', error);
            throw error;
        }
    }

    async importData(file, format = 'auto') {
        try {
            const fileFormat = format === 'auto' ? 
                this.detectFileFormat(file.name) : format;
            
            const text = await file.text();
            let data;
            
            switch (fileFormat) {
                case 'json':
                    data = JSON.parse(text);
                    break;
                    
                case 'csv':
                    data = this.parseCSV(text);
                    break;
                    
                case 'txt':
                    data = this.parseTXT(text);
                    break;
                    
                case 'xml':
                    data = this.parseXML(text);
                    break;
                    
                case 'xlsx':
                case 'xls':
                    if (typeof XLSX !== 'undefined') {
                        data = await this.parseExcel(file);
                    } else {
                        throw new Error('Excel import requires SheetJS library');
                    }
                    break;
                    
                default:
                    throw new Error(`Format ${fileFormat} tidak didukung`);
            }
            
            if (!Array.isArray(data)) {
                throw new Error('Format file tidak valid - harus berupa array');
            }

            const importResults = {
                success: 0,
                failed: 0,
                errors: []
            };
            
            const newArray = [];
            
            for (const item of data) {
                try {
                    let mahasiswa;
                    
                    if (item.negaraAsal) {
                        mahasiswa = new MahasiswaInternasional(
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
                        mahasiswa = new Mahasiswa(
                            item.nim,
                            item.nama,
                            item.tanggalLahir,
                            item.email,
                            item.prodi,
                            item.tahunMasuk,
                            item.alamat || ''
                        );
                    }
                    
                    newArray.push(mahasiswa);
                    importResults.success++;
                    
                } catch (error) {
                    importResults.failed++;
                    importResults.errors.push({
                        item,
                        error: error.message
                    });
                    console.warn('Import error for item:', item, error);
                }
            }
            
            this.mahasiswaArray = newArray;
            this._updateStats();
            this._updateLastUpdate();
            
            return importResults;
            
        } catch (error) {
            console.error('Import error:', error);
            throw error;
        }
    }

    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header];
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                }).join(',')
            )
        ];
        
        return csvRows.join('\n');
    }

    convertToTXT(data) {
        if (data.length === 0) return 'Tidak ada data';
        
        const lines = data.map((item, index) => {
            return `Record ${index + 1}:\n` +
                   Object.entries(item).map(([key, value]) => 
                       `  ${key}: ${value}`
                   ).join('\n');
        });
        
        return lines.join('\n\n');
    }

    convertToXML(data) {
        const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
        const xmlRecords = data.map(item => {
            const fields = Object.entries(item).map(([key, value]) => 
                `<${key}>${this.escapeXML(value)}</${key}>`
            ).join('\n    ');
            
            return `  <record>\n    ${fields}\n  </record>`;
        }).join('\n');
        
        return `${xmlHeader}\n<students>\n${xmlRecords}\n</students>`;
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        return lines.slice(1)
            .filter(line => line.trim())
            .map(line => {
                const values = this.parseCSVLine(line);
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = values[index] || '';
                });
                return obj;
            });
    }

    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"' && !inQuotes) {
                inQuotes = true;
            } else if (char === '"' && inQuotes && nextChar === '"') {
                current += '"';
                i++;
            } else if (char === '"' && inQuotes) {
                inQuotes = false;
            } else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        values.push(current);
        return values;
    }

    parseTXT(txtText) {
        const records = txtText.split('\n\n');
        return records
            .filter(record => record.trim())
            .map(record => {
                const lines = record.split('\n');
                const obj = {};
                
                lines.forEach(line => {
                    const match = line.match(/^\s*([^:]+):\s*(.+)$/);
                    if (match) {
                        const [, key, value] = match;
                        obj[key.trim()] = value.trim();
                    }
                });
                
                return obj;
            });
    }

    parseXML(xmlText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const records = xmlDoc.getElementsByTagName("record");
        const result = [];
        
        for (let record of records) {
            const obj = {};
            const children = record.children;
            
            for (let child of children) {
                obj[child.tagName] = child.textContent;
            }
            
            result.push(obj);
        }
        
        return result;
    }

    async parseExcel(file) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        return XLSX.utils.sheet_to_json(firstSheet);
    }

    async exportToExcel(data, filename) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Mahasiswa");
        XLSX.writeFile(workbook, `${filename}.xlsx`);
        return true;
    }

    escapeXML(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    detectFileFormat(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        
        const formatMap = {
            'json': 'json',
            'csv': 'csv',
            'txt': 'txt',
            'xml': 'xml',
            'xlsx': 'excel',
            'xls': 'excel'
        };
        
        return formatMap[extension] || 'txt';
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// ============================================
// ALGORITHM VISUALIZER - VERSION 3.0
// ============================================

class AlgorithmVisualizer {
    constructor() {
        this.barsContainer = null;
        this.statsContainer = null;
        this.currentData = [];
        this.isVisualizing = false;
        this.animationSpeed = 100;
        this.visualizationType = 'sorting';
        this.comparisons = 0;
        this.swaps = 0;
        this.currentOperation = '';
        this.sortingSteps = [];
        this.currentStep = 0;
        this.isPaused = false;
    }

    initialize() {
        this.barsContainer = document.getElementById('sortBars');
        this.statsContainer = document.getElementById('searchSteps');
        this.showPlaceholder();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const speedSlider = document.getElementById('speedSlider');
        const speedValue = document.getElementById('speedValue');
        const resetBtn = document.getElementById('resetVisualization');
        const startBtn = document.getElementById('startVisualization');
        const pauseBtn = document.getElementById('pauseVisualization');

        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.animationSpeed = 510 - e.target.value;
                if (speedValue) {
                    const speeds = ['Sangat Lambat', 'Lambat', 'Normal', 'Cepat', 'Sangat Cepat'];
                    const index = Math.floor((e.target.value - 10) / 98);
                    speedValue.textContent = speeds[index] || 'Normal';
                }
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (app && app.uiController) {
                    app.uiController.startVisualization();
                }
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                if (app && app.uiController) {
                    app.uiController.togglePauseVisualization();
                }
            });
        }
    }

    showPlaceholder() {
        if (this.barsContainer) {
            this.barsContainer.innerHTML = `
                <div class="visualization-placeholder">
                    <i class="fas fa-chart-bar"></i>
                    <p>Visualisasi Algoritma</p>
                    <small>Pilih algoritma dan klik tombol "Mulai Visualisasi" untuk memulai</small>
                </div>
            `;
        }
        
        this.updateStatsDisplay();
    }

    updateStatsDisplay() {
        const currentOpElement = document.getElementById('currentOperation');
        const comparisonElement = document.getElementById('comparisonCount');
        const swapElement = document.getElementById('swapCount');
        
        if (currentOpElement) {
            currentOpElement.textContent = `Operasi: ${this.currentOperation || '-'}`;
        }
        
        if (comparisonElement) {
            comparisonElement.textContent = `Perbandingan: ${this.comparisons}`;
        }
        
        if (swapElement) {
            swapElement.textContent = `Pertukaran: ${this.swaps}`;
        }
    }

    createSortingVisualization(data, field) {
        if (!this.barsContainer || !data || data.length === 0) {
            this.showPlaceholder();
            return;
        }

        this.currentData = [...data];
        this.barsContainer.innerHTML = '';
        this.comparisons = 0;
        this.swaps = 0;
        
        const numericValues = data.map((item, index) => {
            const value = this._getNumericValue(item, field);
            return {
                value,
                originalIndex: index,
                label: this._getLabel(item, field)
            };
        });

        const maxValue = Math.max(...numericValues.map(v => v.value));
        const minValue = Math.min(...numericValues.map(v => v.value));
        const range = maxValue - minValue || 1;

        numericValues.forEach((item, index) => {
            const bar = document.createElement('div');
            bar.className = 'sort-bar';
            bar.id = `bar-${index}`;
            bar.dataset.index = index;
            bar.dataset.originalIndex = item.originalIndex;
            bar.dataset.value = item.value;
            
            const heightPercentage = 10 + ((item.value - minValue) / range) * 90;
            
            bar.style.height = `${heightPercentage}%`;
            bar.style.width = `${Math.min(95 / data.length, 50)}%`;
            bar.style.backgroundColor = this._getBarColor(index, data.length);
            bar.setAttribute('data-value', item.label);
            bar.title = `${field}: ${item.label}`;
            
            this.barsContainer.appendChild(bar);
        });

        this.updateStatsDisplay();
        this.visualizationType = 'sorting';
    }

    async animateComparison(index1, index2) {
        if (!this.barsContainer || this.isPaused) return;
        
        const bar1 = document.getElementById(`bar-${index1}`);
        const bar2 = document.getElementById(`bar-${index2}`);
        
        if (bar1 && bar2) {
            this.currentOperation = `Membandingkan ${index1} dan ${index2}`;
            this.comparisons++;
            this.updateStatsDisplay();
            
            bar1.classList.add('comparing');
            bar2.classList.add('comparing');
            
            await this._sleep(this.animationSpeed);
            
            bar1.classList.remove('comparing');
            bar2.classList.remove('comparing');
        }
    }

    async animateSwap(index1, index2) {
        if (!this.barsContainer || this.isPaused) return;
        
        const bar1 = document.getElementById(`bar-${index1}`);
        const bar2 = document.getElementById(`bar-${index2}`);
        
        if (bar1 && bar2) {
            this.currentOperation = `Menukar ${index1} dan ${index2}`;
            this.swaps++;
            this.updateStatsDisplay();
            
            const tempHeight = bar1.style.height;
            const tempColor = bar1.style.backgroundColor;
            
            bar1.classList.add('swapping');
            bar2.classList.add('swapping');
            
            bar1.style.height = bar2.style.height;
            bar2.style.height = tempHeight;
            
            bar1.setAttribute('data-value', bar2.getAttribute('data-value'));
            bar2.setAttribute('data-value', tempHeight);
            
            bar1.title = bar2.title;
            bar2.title = `Nilai: ${tempHeight}`;
            
            await this._sleep(this.animationSpeed * 2);
            
            bar1.classList.remove('swapping');
            bar2.classList.remove('swapping');
            
            bar1.style.backgroundColor = this._getBarColor(index1, this.currentData.length);
            bar2.style.backgroundColor = this._getBarColor(index2, this.currentData.length);
        }
    }

    async animateSorted(index) {
        if (!this.barsContainer || this.isPaused) return;
        
        const bar = document.getElementById(`bar-${index}`);
        if (bar) {
            bar.classList.add('sorted');
            await this._sleep(this.animationSpeed / 2);
        }
    }

    async animateSearchStep(index, stepType = 'checking', found = false) {
        if (!this.barsContainer || this.isPaused) return;
        
        const stepsContainer = document.getElementById('searchSteps');
        if (!stepsContainer) return;
        
        this.comparisons++;
        this.currentOperation = `Memeriksa elemen ke-${index}`;
        this.updateStatsDisplay();
        
        const step = document.createElement('div');
        step.className = `step ${stepType}`;
        
        if (found) {
            step.classList.add('found');
            step.innerHTML = `✓ Ditemukan di indeks ${index}`;
        } else {
            step.innerHTML = `Memeriksa indeks ${index}: ${this.currentData[index]?.nama || 'Data'}`;
        }
        
        stepsContainer.appendChild(step);
        stepsContainer.scrollTop = stepsContainer.scrollHeight;
        
        const bar = document.getElementById(`bar-${index}`);
        if (bar && this.visualizationType === 'sorting') {
            bar.classList.add('comparing');
            await this._sleep(this.animationSpeed);
            bar.classList.remove('comparing');
            
            if (found) {
                bar.classList.add('sorted');
            }
        }
        
        await this._sleep(this.animationSpeed);
    }

    _getNumericValue(item, field) {
        const value = item[field];
        
        if (field === 'usia') {
            return item.usia || 0;
        }
        
        if (typeof value === 'number') {
            return value;
        }
        
        if (typeof value === 'string') {
            if (field === 'nim') {
                return parseInt(value) || 0;
            }
            return value.length;
        }
        
        return 0;
    }

    _getLabel(item, field) {
        const value = item[field];
        
        if (field === 'usia') {
            return `${item.usia} tahun`;
        }
        
        if (field === 'nim') {
            return value;
        }
        
        if (field === 'tahunMasuk') {
            return value;
        }
        
        if (typeof value === 'string' && value.length > 15) {
            return value.substring(0, 15) + '...';
        }
        
        return value || '';
    }

    _getBarColor(index, total) {
        const hue = (index * 360) / total;
        return `hsl(${hue}, 70%, 60%)`;
    }

    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    reset() {
        this.isVisualizing = false;
        this.isPaused = false;
        this.comparisons = 0;
        this.swaps = 0;
        this.currentOperation = '';
        this.sortingSteps = [];
        this.currentStep = 0;
        this.showPlaceholder();
    }

    async visualizeBubbleSort(data, field, ascending = true) {
        if (!this.barsContainer) return data;
        
        this.createSortingVisualization(data, field);
        this.isVisualizing = true;
        
        const arr = [...data];
        const n = arr.length;
        let swapped;
        
        do {
            swapped = false;
            for (let i = 0; i < n - 1; i++) {
                if (!this.isVisualizing || this.isPaused) break;
                
                await this.animateComparison(i, i + 1);
                
                const a = this._getNumericValue(arr[i], field);
                const b = this._getNumericValue(arr[i + 1], field);
                const shouldSwap = ascending ? a > b : a < b;
                
                if (shouldSwap) {
                    await this.animateSwap(i, i + 1);
                    
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                    swapped = true;
                }
            }
            
            if (swapped) {
                await this.animateSorted(n - 1);
            }
            
        } while (swapped && this.isVisualizing && !this.isPaused);
        
        if (this.isVisualizing) {
            for (let i = 0; i < n; i++) {
                await this.animateSorted(i);
            }
        }
        
        this.isVisualizing = false;
        return arr;
    }

    async visualizeLinearSearch(data, query, field = 'all') {
        if (!this.barsContainer) return [];
        
        this.createSearchingVisualization(data, field, query, 'Linear');
        this.isVisualizing = true;
        
        const results = [];
        const queryLower = query.toLowerCase().trim();
        
        for (let i = 0; i < data.length && this.isVisualizing && !this.isPaused; i++) {
            const item = data[i];
            let found = false;
            
            if (field === 'all') {
                const obj = { ...item.toObject?.() || item };
                for (const key in obj) {
                    if (String(obj[key]).toLowerCase().includes(queryLower)) {
                        found = true;
                        break;
                    }
                }
            } else {
                const value = item[field];
                if (value && String(value).toLowerCase().includes(queryLower)) {
                    found = true;
                }
            }
            
            await this.animateSearchStep(i, 'checking', found);
            
            if (found) {
                results.push({ index: i, data: item });
            }
        }
        
        this.isVisualizing = false;
        return results;
    }
}

// ============================================
// UI CONTROLLER - VERSION 3.0
// ============================================

class UIController {
    constructor(dataManager, visualizer) {
        this.dataManager = dataManager;
        this.visualizer = visualizer;
        this.isEditing = false;
        this.currentEditIndex = -1;
        this.searchTimeout = null;
        this.selectedExportFormat = 'json';
        this.selectedImportFormat = 'auto';
        
        this.initializeEventListeners();
        this.loadInitialData();
        this.updateTable();
        this.updateDashboard();
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
            this.handleFormSubmit();
        });

        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.cancelEdit();
        });

        // Today button untuk tanggal lahir
        document.getElementById('todayBtn')?.addEventListener('click', () => {
            const today = new Date();
            const minDate = new Date();
            minDate.setFullYear(minDate.getFullYear() - 17);
            
            const dateInput = document.getElementById('tanggalLahir');
            dateInput.valueAsDate = minDate;
        });

        // Export dropdown items - IMPORTANT FIX
        document.querySelectorAll('.dropdown-item[data-format]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const format = e.target.dataset.format || e.target.closest('.dropdown-item').dataset.format;
                const action = e.target.closest('.dropdown').id;
                
                if (action === 'exportBtn') {
                    this.handleExportWithFormat(format);
                } else if (action === 'importBtn') {
                    this.handleImportWithFormat(format);
                }
            });
        });

        // File input change
        document.getElementById('fileInput').addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.handleImport(e.target.files[0], this.selectedImportFormat);
            }
        });

        // Search input dengan debounce
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearchWithDebounce(e.target.value);
        });

        // Search type change
        document.getElementById('searchType').addEventListener('change', () => {
            this.handleSearch(document.getElementById('searchInput').value);
        });

        // Search algorithm change
        document.getElementById('searchAlgorithm').addEventListener('change', () => {
            this.handleSearch(document.getElementById('searchInput').value);
        });

        // Sort buttons
        document.getElementById('sortAscBtn').addEventListener('click', () => {
            this.handleSort(true);
        });

        document.getElementById('sortDescBtn').addEventListener('click', () => {
            this.handleSort(false);
        });

        // Sort field change
        document.getElementById('sortField').addEventListener('change', (e) => {
            this.dataManager.sortState.field = e.target.value;
        });

        // Sort algorithm change
        document.getElementById('sortAlgorithm').addEventListener('change', () => {
            // Hanya update, tidak otomatis sort
        });

        // Visualize button di sort controls
        document.getElementById('visualizeBtn')?.addEventListener('click', () => {
            this.startVisualization();
        });

        // TOMBOL VISUALISASI BARU - IMPORTANT FIX
        document.getElementById('startVisualization').addEventListener('click', () => {
            this.startVisualization();
        });

        document.getElementById('pauseVisualization').addEventListener('click', () => {
            this.togglePauseVisualization();
        });

        // Reset visualization button
        document.getElementById('resetVisualization').addEventListener('click', () => {
            if (this.visualizer) {
                this.visualizer.reset();
                
                // Reset tombol
                document.getElementById('startVisualization').style.display = 'inline-flex';
                document.getElementById('pauseVisualization').style.display = 'none';
                document.getElementById('pauseVisualization').innerHTML = '<i class="fas fa-pause"></i> Jeda';
                document.getElementById('pauseVisualization').classList.remove('btn-success');
                document.getElementById('pauseVisualization').classList.add('btn-warning');
                
                this.showToast('Visualisasi direset', 'info');
            }
        });

        // Pagination
        document.getElementById('firstBtn').addEventListener('click', () => {
            this.goToPage(1);
        });

        document.getElementById('prevBtn').addEventListener('click', () => {
            this.prevPage();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextPage();
        });

        document.getElementById('lastBtn').addEventListener('click', () => {
            this.goToPage(this.dataManager.getTotalPages());
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Help button
        document.getElementById('helpBtn').addEventListener('click', () => {
            this.showHelpModal();
        });

        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideModal(btn.closest('.modal').id);
            });
        });

        document.getElementById('modalOkBtn').addEventListener('click', () => {
            this.hideModal('alertModal');
        });

        document.getElementById('helpCloseBtn').addEventListener('click', () => {
            this.hideModal('helpModal');
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                document.getElementById('saveBtn').click();
            }
            
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                document.getElementById('searchInput').focus();
            }
            
            if (e.key === 'Escape') {
                if (this.isEditing) {
                    this.cancelEdit();
                } else {
                    this.hideAllModals();
                }
            }
        });
    }

    // Form Handling
    handleFormSubmit() {
        try {
            this.clearErrors();

            const formData = {
                nim: document.getElementById('nim').value.trim(),
                nama: document.getElementById('nama').value.trim(),
                tanggalLahir: document.getElementById('tanggalLahir').value,
                email: document.getElementById('email').value.trim(),
                prodi: document.getElementById('prodi').value,
                tahunMasuk: parseInt(document.getElementById('tahunMasuk').value),
                alamat: document.getElementById('alamat').value.trim()
            };

            if (!formData.nim || !formData.nama || !formData.tanggalLahir || 
                !formData.email || !formData.prodi || !formData.tahunMasuk) {
                throw new Error('Semua field wajib diisi kecuali alamat');
            }

            if (!/^\d{10,15}$/.test(formData.nim)) {
                this.showError('nim', 'NIM harus 10-15 digit angka');
                throw new Error('Validasi NIM gagal');
            }

            if (!this.isEditing) {
                const existing = this.dataManager.getMahasiswaByNIM(formData.nim);
                if (existing) {
                    this.showError('nim', 'NIM sudah terdaftar');
                    throw new Error('NIM sudah terdaftar');
                }
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                this.showError('email', 'Format email tidak valid');
                throw new Error('Validasi email gagal');
            }

            const currentYear = new Date().getFullYear();
            if (formData.tahunMasuk < 2000 || formData.tahunMasuk > currentYear + 1) {
                this.showError('tahunMasuk', `Tahun harus antara 2000-${currentYear + 1}`);
                throw new Error('Validasi tahun masuk gagal');
            }

            let mahasiswa;
            
            if (formData.email.includes('.int.') || formData.email.includes('@international.')) {
                mahasiswa = new MahasiswaInternasional(
                    formData.nim,
                    formData.nama,
                    formData.tanggalLahir,
                    formData.email,
                    formData.prodi,
                    formData.tahunMasuk,
                    'International',
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

            if (this.isEditing && this.currentEditIndex >= 0) {
                const success = this.dataManager.updateMahasiswa(this.currentEditIndex, mahasiswa);
                if (success) {
                    this.showToast('Data berhasil diperbarui!', 'success');
                }
            } else {
                this.dataManager.addMahasiswa(mahasiswa);
                this.showToast('Data berhasil disimpan!', 'success');
            }

            this.resetForm();
            this.updateTable();
            this.updateDashboard();

        } catch (error) {
            console.error('Form submission error:', error);
            
            if (error.message !== 'Validasi gagal') {
                this.showToast(`Error: ${error.message}`, 'error');
            }
        }
    }

    clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
    }

    showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    // Search Handling
    handleSearchWithDebounce(query) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.handleSearch(query);
        }, 300);
    }

    handleSearch(query) {
        const searchType = document.getElementById('searchType').value;
        const algorithm = document.getElementById('searchAlgorithm').value;
        
        let results = [];
        let stats = { comparisons: 0, operations: 0 };
        
        this.dataManager.clearSearch();
        
        if (query.trim() === '') {
            this.dataManager.searchResults = null;
            this.updateTable();
            document.getElementById('complexityInfo').textContent = '';
            return;
        }
        
        try {
            switch (algorithm) {
                case 'linear':
                    results = this.dataManager.linearSearch(query, searchType);
                    stats = this.dataManager.getAlgorithmStats();
                    break;
                    
                case 'binary':
                    results = this.dataManager.binarySearch(query, searchType);
                    stats = this.dataManager.getAlgorithmStats();
                    break;
                    
                case 'sequential':
                    results = this.dataManager.sequentialSearch(query, searchType);
                    stats = this.dataManager.getAlgorithmStats();
                    break;
            }
            
            this.dataManager.searchResults = results.map(r => r.data);
            this.dataManager.currentPage = 1;
            
            this.updateTable();
            
            const complexityInfo = document.getElementById('complexityInfo');
            if (complexityInfo) {
                let complexityText = '';
                switch (algorithm) {
                    case 'linear': complexityText = 'O(n)'; break;
                    case 'binary': complexityText = 'O(log n)'; break;
                    case 'sequential': complexityText = 'O(n)'; break;
                }
                complexityInfo.textContent = `${complexityText} | ${results.length} hasil | ${stats.comparisons} perbandingan`;
            }
            
            if (results.length === 0) {
                this.showToast('Tidak ditemukan hasil pencarian', 'warning');
            }
            
        } catch (error) {
            console.error('Search error:', error);
            this.showToast(`Error pencarian: ${error.message}`, 'error');
        }
    }

    // Sort Handling
    handleSort(ascending = true) {
        const field = document.getElementById('sortField').value;
        const algorithm = document.getElementById('sortAlgorithm').value;
        
        this.dataManager.sortState = { field, ascending };
        
        let sortedData;
        let complexity = '';
        let stats = { comparisons: 0, swaps: 0 };
        
        try {
            switch (algorithm) {
                case 'bubble':
                    sortedData = this.dataManager.bubbleSort(field, ascending);
                    complexity = 'O(n²)';
                    break;
                case 'insertion':
                    sortedData = this.dataManager.insertionSort(field, ascending);
                    complexity = 'O(n²)';
                    break;
                case 'selection':
                    sortedData = this.dataManager.selectionSort(field, ascending);
                    complexity = 'O(n²)';
                    break;
                case 'merge':
                    sortedData = this.dataManager.mergeSort(field, ascending);
                    complexity = 'O(n log n)';
                    break;
                case 'shell':
                    sortedData = this.dataManager.shellSort(field, ascending);
                    complexity = 'O(n log n)';
                    break;
                default:
                    sortedData = this.dataManager.mahasiswaArray;
                    complexity = 'Original';
            }
            
            this.dataManager.mahasiswaArray = sortedData;
            this.dataManager.currentPage = 1;
            
            stats = this.dataManager.getAlgorithmStats();
            
            this.updateTable();
            this.updateDashboard();
            
            document.getElementById('complexityInfo').textContent = 
                `${complexity} | ${stats.comparisons} perbandingan | ${stats.swaps} pertukaran`;
            
            this.updateSortButtonStates(ascending);
            
            this.showToast(`Data berhasil diurutkan dengan ${algorithm} sort`, 'success');
            
        } catch (error) {
            console.error('Sort error:', error);
            this.showToast(`Error sorting: ${error.message}`, 'error');
        }
    }

    // Visualisasi
    startVisualization() {
        const algorithm = document.getElementById('sortAlgorithm').value;
        const field = document.getElementById('sortField').value;
        const ascending = document.getElementById('sortAscBtn').classList.contains('active');
        
        if (this.dataManager.mahasiswaArray.length === 0) {
            this.showToast('Tidak ada data untuk divisualisasikan', 'warning');
            return;
        }
        
        // Update tombol
        document.getElementById('startVisualization').style.display = 'none';
        document.getElementById('pauseVisualization').style.display = 'inline-flex';
        
        // Jalankan visualisasi
        this.handleSortWithVisualization(algorithm, field, ascending);
    }

    async handleSortWithVisualization(algorithm = null, field = null, ascending = null) {
        algorithm = algorithm || document.getElementById('sortAlgorithm').value;
        field = field || document.getElementById('sortField').value;
        ascending = ascending !== null ? ascending : 
                   document.getElementById('sortAscBtn').classList.contains('active');
        
        if (!this.visualizer) {
            this.showToast('Visualizer belum siap', 'warning');
            return;
        }
        
        if (this.dataManager.mahasiswaArray.length === 0) {
            this.showToast('Tidak ada data untuk divisualisasikan', 'warning');
            return;
        }
        
        try {
            this.showLoading(true, 'Memulai visualisasi...');
            
            let sortedData;
            
            switch (algorithm) {
                case 'bubble':
                    sortedData = await this.visualizer.visualizeBubbleSort(
                        this.dataManager.mahasiswaArray,
                        field,
                        ascending
                    );
                    break;
                    
                case 'insertion':
                    // Tambahkan visualisasi untuk insertion sort jika diperlukan
                    this.showToast(`Visualisasi untuk ${algorithm} sort belum tersedia`, 'info');
                    break;
                    
                default:
                    sortedData = this.dataManager.mahasiswaArray;
                    this.showToast(`Visualisasi untuk ${algorithm} sort belum tersedia`, 'info');
            }
            
            if (sortedData && this.visualizer.isVisualizing) {
                this.dataManager.mahasiswaArray = sortedData;
                this.dataManager.currentPage = 1;
                this.updateTable();
                this.updateDashboard();
                this.updateSortButtonStates(ascending);
                
                this.showToast(`Visualisasi ${algorithm} sort selesai`, 'success');
            }
            
        } catch (error) {
            console.error('Sort visualization error:', error);
            this.showToast(`Error visualisasi: ${error.message}`, 'error');
        } finally {
            this.showLoading(false);
            
            // Reset tombol setelah selesai
            document.getElementById('startVisualization').style.display = 'inline-flex';
            document.getElementById('pauseVisualization').style.display = 'none';
            document.getElementById('pauseVisualization').innerHTML = '<i class="fas fa-pause"></i> Jeda';
            document.getElementById('pauseVisualization').classList.remove('btn-success');
            document.getElementById('pauseVisualization').classList.add('btn-warning');
        }
    }

    togglePauseVisualization() {
        if (this.visualizer) {
            const isPaused = this.visualizer.isPaused;
            this.visualizer.isPaused = !isPaused;
            
            const pauseBtn = document.getElementById('pauseVisualization');
            
            if (isPaused) {
                // Resume
                this.visualizer.resume();
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Jeda';
                pauseBtn.classList.remove('btn-success');
                pauseBtn.classList.add('btn-warning');
                this.showToast('Visualisasi dilanjutkan', 'info');
            } else {
                // Pause
                this.visualizer.pause();
                pauseBtn.innerHTML = '<i class="fas fa-play"></i> Lanjut';
                pauseBtn.classList.remove('btn-warning');
                pauseBtn.classList.add('btn-success');
                this.showToast('Visualisasi dijeda', 'warning');
            }
        }
    }

    updateSortButtonStates(ascending) {
        const ascBtn = document.getElementById('sortAscBtn');
        const descBtn = document.getElementById('sortDescBtn');
        
        if (ascending) {
            ascBtn.classList.add('active');
            descBtn.classList.remove('active');
        } else {
            ascBtn.classList.remove('active');
            descBtn.classList.add('active');
        }
    }

    // Table Handling
    updateTable() {
        const tableBody = document.getElementById('tableBody');
        const data = this.dataManager.getPaginatedData(this.dataManager.currentPage);
        const totalPages = this.dataManager.getTotalPages();
        
        document.getElementById('pageInfo').textContent = 
            `Halaman ${this.dataManager.currentPage} dari ${totalPages}`;
        
        document.getElementById('firstBtn').disabled = this.dataManager.currentPage <= 1;
        document.getElementById('prevBtn').disabled = this.dataManager.currentPage <= 1;
        document.getElementById('nextBtn').disabled = this.dataManager.currentPage >= totalPages;
        document.getElementById('lastBtn').disabled = this.dataManager.currentPage >= totalPages;
        
        const totalData = this.dataManager.searchResults ? 
            this.dataManager.searchResults.length : 
            this.dataManager.mahasiswaArray.length;
        document.getElementById('rowCount').textContent = totalData;
        
        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8">
                        <div class="empty-state">
                            <i class="fas fa-database"></i>
                            <h3>${totalData === 0 ? 'Belum Ada Data' : 'Tidak Ditemukan'}</h3>
                            <p>${totalData === 0 ? 
                                'Mulai dengan menambahkan data mahasiswa menggunakan form di atas' : 
                                'Coba dengan kata kunci pencarian yang berbeda'}</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = '';
        
        data.forEach((mahasiswa, index) => {
            const tr = document.createElement('tr');
            const displayData = mahasiswa.toDisplay();
            const actualIndex = (this.dataManager.currentPage - 1) * this.dataManager.pageSize + index;
            
            tr.innerHTML = `
                <td>${actualIndex + 1}</td>
                <td><strong>${displayData.nim}</strong></td>
                <td>${displayData.nama}</td>
                <td><a href="mailto:${displayData.email}">${displayData.email}</a></td>
                <td><span class="badge">${displayData.prodi}</span></td>
                <td>${displayData.usia}</td>
                <td>${displayData.tahunMasuk}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary edit-btn" data-index="${actualIndex}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-btn" data-index="${actualIndex}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(tr);
        });
        
        this.attachActionButtonListeners();
    }

    attachActionButtonListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.editMahasiswa(index);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.deleteMahasiswa(index);
            });
        });
    }

    editMahasiswa(index) {
        const mahasiswa = this.dataManager.getMahasiswa(index);
        if (!mahasiswa) return;
        
        this.isEditing = true;
        this.currentEditIndex = index;
        
        document.getElementById('nim').value = mahasiswa.nim;
        document.getElementById('nama').value = mahasiswa.nama;
        
        const [day, month, year] = mahasiswa.tanggalLahir.split('/');
        document.getElementById('tanggalLahir').value = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        
        document.getElementById('email').value = mahasiswa.email;
        document.getElementById('prodi').value = mahasiswa.prodi;
        document.getElementById('tahunMasuk').value = mahasiswa.tahunMasuk;
        document.getElementById('alamat').value = mahasiswa.alamat || '';
        
        document.getElementById('nim').disabled = true;
        
        document.getElementById('saveBtn').style.display = 'none';
        document.getElementById('updateBtn').style.display = 'inline-flex';
        document.getElementById('cancelBtn').style.display = 'inline-flex';
        
        document.getElementById('formStatus').textContent = 'Mode: Edit Data';
        
        document.getElementById('mahasiswaForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        this.showToast('Mode edit diaktifkan', 'info');
    }

    deleteMahasiswa(index) {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            const success = this.dataManager.deleteMahasiswa(index);
            
            if (success) {
                if (this.isEditing && this.currentEditIndex === index) {
                    this.cancelEdit();
                }
                
                this.updateTable();
                this.updateDashboard();
                this.showToast('Data berhasil dihapus', 'success');
            } else {
                this.showToast('Gagal menghapus data', 'error');
            }
        }
    }

    // Pagination
    goToPage(page) {
        const totalPages = this.dataManager.getTotalPages();
        if (page >= 1 && page <= totalPages) {
            this.dataManager.currentPage = page;
            this.updateTable();
        }
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

    // Form Management
    resetForm() {
        document.getElementById('mahasiswaForm').reset();
        document.getElementById('nim').disabled = false;
        this.clearErrors();
        
        this.isEditing = false;
        this.currentEditIndex = -1;
        
        document.getElementById('saveBtn').style.display = 'inline-flex';
        document.getElementById('updateBtn').style.display = 'none';
        document.getElementById('cancelBtn').style.display = 'none';
        
        document.getElementById('formStatus').textContent = 'Mode: Tambah Data';
        
        document.getElementById('nim').focus();
    }

    cancelEdit() {
        this.resetForm();
        this.showToast('Edit dibatalkan', 'info');
    }

    // Dashboard
    updateDashboard() {
        this.updateLastUpdateTime();
    }

    updateLastUpdateTime() {
        const lastUpdateElement = document.getElementById('lastUpdate');
        const lastUpdateDetail = document.getElementById('lastUpdateDetail');
        
        if (lastUpdateElement && lastUpdateDetail) {
            const now = new Date();
            const dateStr = now.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const timeStr = now.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            lastUpdateDetail.textContent = `${dateStr} ${timeStr}`;
        }
    }

    // File Operations - IMPORTANT FIX
    async handleExportWithFormat(format) {
        try {
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
            const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
            const filename = `mahasiswa_data_${dateStr}_${timeStr}`;
            
            this.showLoading(true, `Mengekspor data ke format ${format.toUpperCase()}...`);
            
            if (format === 'excel') {
                const data = this.dataManager.mahasiswaArray.map(m => m.toObject());
                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Mahasiswa");
                XLSX.writeFile(workbook, `${filename}.xlsx`);
            } else {
                await this.dataManager.exportData(format, filename);
            }
            
            this.showToast(`Data berhasil diekspor ke format ${format.toUpperCase()}`, 'success');
            
        } catch (error) {
            console.error('Export error:', error);
            this.showToast(`Error ekspor: ${error.message}`, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleImportWithFormat(format) {
        this.selectedImportFormat = format;
        document.getElementById('fileInput').click();
    }

    async handleImport(file, format = 'auto') {
        if (!file) return;
        
        try {
            this.showLoading(true, 'Mengimpor data...');
            
            const result = await this.dataManager.importData(file, format);
            
            this.updateTable();
            this.updateDashboard();
            
            if (result.failed > 0) {
                this.showToast(
                    `${result.success} data berhasil, ${result.failed} gagal diimpor`,
                    result.failed > result.success ? 'error' : 'warning'
                );
                
                if (result.errors.length > 0) {
                    console.log('Import errors:', result.errors);
                }
            } else {
                this.showToast(`${result.success} data berhasil diimpor`, 'success');
            }
            
        } catch (error) {
            console.error('Import error:', error);
            this.showToast(`Error impor: ${error.message}`, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // UI Helpers
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        toast.innerHTML = `
            <i class="toast-icon ${icons[type] || 'fas fa-info-circle'}"></i>
            <div class="toast-message">${message}</div>
            <button class="toast-close">&times;</button>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }
        }, 5000);
        
        toast.querySelector('.toast-close').addEventListener('click', () => {
            if (toast.parentNode) {
                toast.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }
        });
    }

    showModal(modalId, title = '', message = '') {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        if (title) {
            const titleElement = modal.querySelector('.modal-header h3');
            if (titleElement) titleElement.textContent = title;
        }
        
        if (message) {
            const messageElement = modal.querySelector('.modal-body p');
            if (messageElement) messageElement.textContent = message;
        }
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    hideAllModals() {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
        document.body.style.overflow = '';
    }

    showHelpModal() {
        this.showModal('helpModal');
    }

    showLoading(show, message = 'Memproses...') {
        const overlay = document.getElementById('loadingOverlay');
        const messageElement = document.getElementById('loadingMessage');
        
        if (messageElement) {
            messageElement.textContent = message;
        }
        
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
        
        if (newTheme === 'dark') {
            icon.className = 'fas fa-sun';
            icon.title = 'Switch to Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            icon.title = 'Switch to Dark Mode';
        }
        
        localStorage.setItem('theme', newTheme);
        
        this.showToast(`Mode ${newTheme === 'dark' ? 'gelap' : 'terang'} diaktifkan`, 'info');
    }

    // Data Management
    loadInitialData() {
        this.loadFromLocalStorage();
        
        if (this.dataManager.mahasiswaArray.length === 0) {
            this.loadSampleData();
        }
        
        this.updateDashboard();
    }

    loadSampleData() {
        try {
            const sampleData = [
                new Mahasiswa(
                    '20241010001',
                    'Budi Santoso',
                    '15/05/2003',
                    'budi.santoso@student.university.ac.id',
                    'Informatika',
                    2024,
                    'Jl. Merdeka No. 123, Jakarta'
                ),
                new Mahasiswa(
                    '20241010002',
                    'Siti Aminah',
                    '22/08/2002',
                    'siti.aminah@student.university.ac.id',
                    'Sistem Informasi',
                    2024,
                    'Jl. Sudirman No. 45, Bandung'
                ),
                new Mahasiswa(
                    '20241010003',
                    'Ahmad Rizki',
                    '10/11/2001',
                    'ahmad.rizki@student.university.ac.id',
                    'Teknik Komputer',
                    2023,
                    'Jl. Gatot Subroto No. 67, Surabaya'
                ),
                new Mahasiswa(
                    '20241010004',
                    'Dewi Lestari',
                    '03/03/2004',
                    'dewi.lestari@student.university.ac.id',
                    'Manajemen',
                    2024,
                    'Jl. Thamrin No. 89, Yogyakarta'
                ),
                new Mahasiswa(
                    '20241010005',
                    'Rudi Hermawan',
                    '18/09/2003',
                    'rudi.hermawan@student.university.ac.id',
                    'Akuntansi',
                    2024,
                    'Jl. Pemuda No. 12, Semarang'
                )
            ];
            
            sampleData.forEach(mahasiswa => {
                this.dataManager.addMahasiswa(mahasiswa);
            });
            
            this.showToast('Data sampel berhasil dimuat', 'info');
            
        } catch (error) {
            console.error('Error loading sample data:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('mahasiswa_data');
            if (saved) {
                const data = JSON.parse(saved);
                let loadedCount = 0;
                
                data.forEach(item => {
                    try {
                        let mahasiswa;
                        
                        if (item.negaraAsal) {
                            mahasiswa = new MahasiswaInternasional(
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
                            mahasiswa = new Mahasiswa(
                                item.nim,
                                item.nama,
                                item.tanggalLahir,
                                item.email,
                                item.prodi,
                                item.tahunMasuk,
                                item.alamat || ''
                            );
                        }
                        
                        this.dataManager.addMahasiswa(mahasiswa);
                        loadedCount++;
                        
                    } catch (error) {
                        console.warn('Failed to restore item:', item, error);
                    }
                });
                
                if (loadedCount > 0) {
                    console.log(`${loadedCount} data loaded from localStorage`);
                }
            }
        } catch (error) {
            console.error('Load from localStorage error:', error);
        }
    }

    saveToLocalStorage() {
        try {
            const data = this.dataManager.mahasiswaArray.map(m => m.toObject());
            localStorage.setItem('mahasiswa_data', JSON.stringify(data));
            
            setTimeout(() => this.saveToLocalStorage(), 30000);
            
        } catch (error) {
            console.error('Save to localStorage error:', error);
        }
    }
}

// ============================================
// APPLICATION INITIALIZATION
// ============================================

class Application {
    constructor() {
        this.dataManager = null;
        this.visualizer = null;
        this.uiController = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            // Initialize Data Manager
            this.dataManager = new DataManager();
            
            // Initialize Algorithm Visualizer
            this.visualizer = new AlgorithmVisualizer();
            
            // Initialize UI Controller
            this.uiController = new UIController(this.dataManager, this.visualizer);
            
            // Initialize Visualizer
            this.visualizer.initialize();
            
            // Setup auto-save
            this.setupAutoSave();
            
            // Load theme preference
            this.loadTheme();
            
            // Setup error handling
            this.setupErrorHandling();
            
            this.isInitialized = true;
            
            console.log('=== Aplikasi Manajemen Data Mahasiswa ===');
            console.log('Version: 3.0');
            console.log('Status: Initialized successfully');
            console.log('Features: OOP, CRUD, Searching, Sorting, File I/O, Visualization');
            
            setTimeout(() => {
                this.uiController.showToast(
                    'Sistem siap digunakan! Selamat datang di Manajemen Data Mahasiswa v3.0',
                    'info'
                );
            }, 1000);
            
        } catch (error) {
            console.error('Application initialization error:', error);
            alert('Terjadi kesalahan saat menginisialisasi aplikasi. Silakan refresh halaman.');
        }
    }

    setupAutoSave() {
        setInterval(() => {
            if (this.uiController) {
                this.uiController.saveToLocalStorage();
            }
        }, 30000);
        
        window.addEventListener('beforeunload', () => {
            if (this.uiController) {
                this.uiController.saveToLocalStorage();
            }
        });
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            if (savedTheme === 'dark') {
                icon.className = 'fas fa-sun';
                icon.title = 'Switch to Light Mode';
            } else {
                icon.className = 'fas fa-moon';
                icon.title = 'Switch to Dark Mode';
            }
        }
    }

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            if (this.uiController) {
                this.uiController.showToast('Terjadi kesalahan sistem', 'error');
            }
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            if (this.uiController) {
                this.uiController.showToast('Terjadi kesalahan dalam operasi', 'error');
            }
        });
    }
}

// Create global application instance
window.app = new Application();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Public API untuk debugging
window.MahasiswaSystem = {
    getInstance: () => app,
    getDataManager: () => app?.dataManager,
    getUIController: () => app?.uiController,
    getVisualizer: () => app?.visualizer,
    
    addSampleData: () => {
        if (app?.uiController) {
            app.uiController.loadSampleData();
        }
    },
    
    clearAllData: () => {
        if (app?.dataManager) {
            app.dataManager.mahasiswaArray = [];
            app.uiController?.updateTable();
            app.uiController?.updateDashboard();
            localStorage.removeItem('mahasiswa_data');
        }
    },
    
    exportAllData: () => {
        if (app?.uiController) {
            app.uiController.handleExportWithFormat('json');
        }
    }
};
