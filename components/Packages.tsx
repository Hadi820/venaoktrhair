import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Package, AddOn, Project, PhysicalItem, Profile } from '../types';
import PageHeader from './PageHeader';
import Modal from './Modal';
import { PencilIcon, Trash2Icon, PlusIcon, Share2Icon, FileTextIcon, CameraIcon } from '../constants';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

const emptyPackageForm = {
    name: '',
    price: '',
    category: '',
    processingTime: '',
    photographers: '',
    videographers: '',
    physicalItems: [{ name: '', price: '' as string | number }],
    digitalItems: [''],
    coverImage: '',
};
const emptyAddOnForm = { name: '', price: '' };

interface PackagesProps {
    packages: Package[];
    setPackages: React.Dispatch<React.SetStateAction<Package[]>>;
    addOns: AddOn[];
    setAddOns: React.Dispatch<React.SetStateAction<AddOn[]>>;
    projects: Project[];
    profile: Profile;
}

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});


const Packages: React.FC<PackagesProps> = ({ packages, setPackages, addOns, setAddOns, projects, profile }) => {
  const [packageFormData, setPackageFormData] = useState<any>(emptyPackageForm);
  const [packageEditMode, setPackageEditMode] = useState<string | null>(null);

  const [addOnFormData, setAddOnFormData] = useState(emptyAddOnForm);
  const [addOnEditMode, setAddOnEditMode] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const publicPackagesUrl = useMemo(() => {
    // A more robust solution would involve getting the vendor's unique ID
    const vendorId = 'VEN001'; // Placeholder for the default vendor
    return `${window.location.origin}${window.location.pathname}#/public-packages/${vendorId}`;
  }, []);

  const copyPackagesLinkToClipboard = () => {
      navigator.clipboard.writeText(publicPackagesUrl).then(() => {
          alert('Tautan halaman paket berhasil disalin!');
      });
  };

  const packagesByCategory = useMemo(() => {
    const grouped: Record<string, Package[]> = {};
    for (const pkg of packages) {
        const category = pkg.category || 'Tanpa Kategori';
        if (!grouped[category]) {
            grouped[category] = [];
        }
        grouped[category].push(pkg);
    }
    return grouped;
  }, [packages]);


  // --- Package Handlers ---
  const handlePackageInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPackageFormData(prev => ({...prev, [name]: value}));
  };
  
   const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await toBase64(file);
            setPackageFormData(prev => ({ ...prev, coverImage: base64 }));
        }
    };

  const handlePhysicalItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const list = [...packageFormData.physicalItems];
    list[index] = { ...list[index], [name]: value };
    setPackageFormData(prev => ({ ...prev, physicalItems: list }));
  };

  const addPhysicalItem = () => {
    setPackageFormData(prev => ({ ...prev, physicalItems: [...prev.physicalItems, { name: '', price: '' }] }));
  };

  const removePhysicalItem = (index: number) => {
    const list = [...packageFormData.physicalItems];
    list.splice(index, 1);
    setPackageFormData(prev => ({ ...prev, physicalItems: list }));
  };
  
  const handleDigitalItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const list = [...packageFormData.digitalItems];
    list[index] = value;
    setPackageFormData(prev => ({ ...prev, digitalItems: list }));
  };

  const addDigitalItem = () => {
    setPackageFormData(prev => ({ ...prev, digitalItems: [...prev.digitalItems, ''] }));
  };

  const removeDigitalItem = (index: number) => {
    const list = [...packageFormData.digitalItems];
    list.splice(index, 1);
    setPackageFormData(prev => ({ ...prev, digitalItems: list }));
  };


  const handlePackageCancelEdit = () => {
    setPackageEditMode(null);
    setPackageFormData(emptyPackageForm);
  }

  const handlePackageEdit = (pkg: Package) => {
    setPackageEditMode(pkg.id);
    setPackageFormData({
        name: pkg.name,
        price: pkg.price.toString(),
        category: pkg.category,
        processingTime: pkg.processing_time || '',
        photographers: pkg.photographers || '',
        videographers: pkg.videographers || '',
        physicalItems: pkg.physical_items && pkg.physical_items.length > 0 ? pkg.physical_items.map(item => ({...item, price: item.price.toString()})) : [{ name: '', price: '' }],
        digitalItems: pkg.digital_items && pkg.digital_items.length > 0 ? pkg.digital_items : [''],
        coverImage: pkg.cover_image || '',
    });
  }

  const handlePackageDelete = async (pkgId: string) => {
    const isPackageInUse = projects.some(p => p.packageId === pkgId);
    if (isPackageInUse) {
        alert("Paket ini tidak dapat dihapus karena sedang digunakan oleh satu atau lebih proyek. Hapus atau ubah proyek tersebut terlebih dahulu.");
        return;
    }

    if (window.confirm("Apakah Anda yakin ingin menghapus paket ini?")) {
        const { error } = await supabase.from('packages').delete().match({ id: pkgId });
        if (error) {
            console.error("Error deleting package:", error);
            alert("Gagal menghapus paket.");
        } else {
            alert("Paket berhasil dihapus.");
            window.location.reload();
        }
    }
  }

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageFormData.name || !packageFormData.price) {
        alert('Nama Paket dan Harga tidak boleh kosong.');
        return;
    }

    const packageData = {
        name: packageFormData.name,
        price: Number(packageFormData.price),
        category: packageFormData.category,
        processing_time: packageFormData.processingTime,
        photographers: packageFormData.photographers,
        videographers: packageFormData.videographers,
        physical_items: packageFormData.physicalItems
            .filter((item: PhysicalItem) => typeof item.name === 'string' && item.name.trim() !== '')
            .map((item: { name: string, price: string | number }) => ({ name: item.name, price: Number(item.price || 0) })),
        digital_items: packageFormData.digitalItems.filter((item: string) => item.trim() !== ''),
        cover_image: packageFormData.coverImage,
    };
    
    let error;

    if (packageEditMode !== 'new' && packageEditMode) {
        const { error: updateError } = await supabase.from('packages').update(packageData).match({ id: packageEditMode });
        error = updateError;
    } else {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
            alert('Error: Anda harus login untuk membuat paket.');
            console.error('Session error:', sessionError);
            return;
        }
        const vendorId = sessionData.session.user.id;
        const { error: insertError } = await supabase.from('packages').insert([{ ...packageData, vendor_id: vendorId }]);
        error = insertError;
    }

    if (error) {
        console.error("Error saving package:", error);
        alert(`Gagal menyimpan paket: ${error.message}`);
    } else {
        alert(`Paket berhasil ${packageEditMode === 'new' ? 'disimpan' : 'diperbarui'}.`);
        handlePackageCancelEdit();
        window.location.reload();
    }
  };

  // --- AddOn Handlers ---
  const handleAddOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddOnFormData(prev => ({...prev, [name]: value}));
  };
  
    const handleAddOnSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addOnFormData.name || !addOnFormData.price) {
            alert('Nama Add-On dan Harga tidak boleh kosong.');
            return;
        }

        const addOnData = {
            name: addOnFormData.name,
            price: Number(addOnFormData.price),
        };
        
        let error;

        if (addOnEditMode) {
            const { error: updateError } = await supabase.from('add_ons').update(addOnData).match({ id: addOnEditMode });
            error = updateError;
        } else {
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !sessionData.session) {
                alert('Error: Anda harus login untuk membuat add-on.');
                console.error('Session error:', sessionError);
                return;
            }
            const vendorId = sessionData.session.user.id;
            const { error: insertError } = await supabase.from('add_ons').insert([{ ...addOnData, vendor_id: vendorId }]);
            error = insertError;
        }

        if (error) {
            console.error("Error saving add-on:", error);
            alert(`Gagal menyimpan add-on: ${error.message}`);
        } else {
            alert(`Add-on berhasil ${addOnEditMode ? 'diperbarui' : 'disimpan'}.`);
            handleAddOnCancelEdit();
            window.location.reload();
        }
    };

  const handleAddOnCancelEdit = () => {
    setAddOnEditMode(null);
    setAddOnFormData(emptyAddOnForm);
  }

  const handleAddOnEdit = (addOn: AddOn) => {
    setAddOnEditMode(addOn.id);
    setAddOnFormData({
        name: addOn.name,
        price: addOn.price.toString(),
    });
  }

  const handleAddOnDelete = async (addOnId: string) => {
    const isAddOnInUse = projects.some(p => p.addOns.some(a => a.id === addOnId));
    if (isAddOnInUse) {
        alert("Add-on ini tidak dapat dihapus karena sedang digunakan oleh satu atau lebih proyek. Hapus atau ubah proyek tersebut terlebih dahulu.");
        return;
    }

    if (window.confirm("Apakah Anda yakin ingin menghapus add-on ini?")) {
        const { error } = await supabase.from('add_ons').delete().match({ id: addOnId });
        if (error) {
            console.error("Error deleting add-on:", error);
            alert("Gagal menghapus add-on.");
        } else {
            alert("Add-on berhasil dihapus.");
            window.location.reload();
        }
    }
  };

  return (
        <div className="space-y-6">
            <PageHeader title="Manajemen Paket & Add-On" subtitle="Kelola semua paket layanan dan item tambahan yang Anda tawarkan.">
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsInfoModalOpen(true)} className="button-secondary">Pelajari Halaman Ini</button>
                    <button onClick={() => setIsShareModalOpen(true)} className="button-secondary inline-flex items-center gap-2">
                        <Share2Icon className="w-4 h-4" /> Bagikan Halaman Paket
                    </button>
                    <button onClick={() => setPackageEditMode('new')} className="button-primary inline-flex items-center gap-2">
                        <PlusIcon className="w-5 h-5"/> Tambah Paket
                    </button>
                </div>
            </PageHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    {Object.entries(packagesByCategory).map(([category, pkgs]) => (
                        <div key={category}>
                            <h3 className="text-xl font-bold text-gradient mb-4">{category}</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {(Array.isArray(pkgs) ? pkgs : []).map(pkg => (
                                    <div key={pkg.id} className="bg-brand-surface rounded-2xl shadow-lg border border-brand-border flex flex-col overflow-hidden">
                                        {pkg.coverImage ? (
                                            <img src={pkg.coverImage} alt={pkg.name} className="w-full h-40 object-cover" />
                                        ) : (
                                            <div className="w-full h-40 bg-brand-bg flex items-center justify-center">
                                                <CameraIcon className="w-12 h-12 text-brand-text-secondary" />
                                            </div>
                                        )}
                                        <div className="p-4 flex-grow flex flex-col">
                                            <h4 className="font-bold text-brand-text-light">{pkg.name}</h4>
                                            <p className="text-2xl font-bold text-brand-accent my-2">{formatCurrency(pkg.price)}</p>
                                            <p className="text-xs text-brand-text-secondary mb-3">Waktu Pengerjaan: {pkg.processingTime}</p>
                                            <div className="text-sm space-y-2 flex-grow">
                                                {(pkg.photographers || pkg.videographers) && <div><h5 className="font-semibold text-brand-text-primary text-xs uppercase tracking-wider mb-1">Tim</h5><p className="text-brand-text-secondary">{[pkg.photographers, pkg.videographers].filter(Boolean).join(' & ')}</p></div>}
                                                {pkg.digitalItems.length > 0 && <div><h5 className="font-semibold text-brand-text-primary text-xs uppercase tracking-wider mb-1">Digital</h5><ul className="list-disc list-inside text-brand-text-secondary">{pkg.digitalItems.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}
                                                {pkg.physicalItems.length > 0 && <div><h5 className="font-semibold text-brand-text-primary text-xs uppercase tracking-wider mb-1">Fisik</h5><ul className="list-disc list-inside text-brand-text-secondary">{pkg.physicalItems.map((item, i) => <li key={i}>{item.name}</li>)}</ul></div>}
                                            </div>
                                            <div className="flex gap-2 mt-4 pt-4 border-t border-brand-border">
                                                <button onClick={() => handlePackageEdit(pkg)} className="button-secondary flex-1 text-sm">Edit</button>
                                                <button onClick={() => handlePackageDelete(pkg.id)} className="button-secondary text-brand-danger border-brand-danger hover:bg-brand-danger/10 flex-shrink-0 px-3"><Trash2Icon className="w-4 h-4"/></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                
                <aside className="lg:col-span-1 space-y-6 sticky top-24">
                    <div className="bg-brand-surface rounded-2xl shadow-lg border border-brand-border">
                        <h3 className="font-semibold text-brand-text-light p-4 border-b border-brand-border">Add-Ons</h3>
                        <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
                            {addOns.map(addon => (
                                <div key={addon.id} className="flex justify-between items-center bg-brand-bg p-2 rounded-md text-sm">
                                    <span className="text-brand-text-primary">{addon.name} - {formatCurrency(addon.price)}</span>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleAddOnEdit(addon)} className="p-1.5 text-brand-text-secondary hover:text-brand-accent"><PencilIcon className="w-4 h-4"/></button>
                                        <button onClick={() => handleAddOnDelete(addon.id)} className="p-1.5 text-brand-text-secondary hover:text-brand-danger"><Trash2Icon className="w-4 h-4"/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleAddOnSubmit} className="p-4 border-t border-brand-border space-y-2">
                             <div className="input-group">
                                <input type="text" id="addOnName" name="name" value={addOnFormData.name} onChange={handleAddOnInputChange} className="input-field" placeholder=" " required />
                                <label htmlFor="addOnName" className="input-label">{addOnEditMode ? 'Edit Nama' : 'Nama Add-On Baru'}</label>
                            </div>
                             <div className="input-group">
                                <input type="number" id="addOnPrice" name="price" value={addOnFormData.price} onChange={handleAddOnInputChange} className="input-field" placeholder=" " required />
                                <label htmlFor="addOnPrice" className="input-label">Harga</label>
                            </div>
                            <div className="flex gap-2 justify-end">
                                {addOnEditMode && <button type="button" onClick={handleAddOnCancelEdit} className="button-secondary text-sm">Batal</button>}
                                <button type="submit" className="button-primary text-sm">{addOnEditMode ? 'Update' : 'Tambah'}</button>
                            </div>
                        </form>
                    </div>
                </aside>
            </div>

            <Modal isOpen={packageEditMode !== null} onClose={handlePackageCancelEdit} title={packageEditMode === 'new' ? 'Tambah Paket Baru' : 'Edit Paket'} size="3xl">
                <form onSubmit={handlePackageSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="input-group"><input type="text" name="name" value={packageFormData.name} onChange={handlePackageInputChange} className="input-field" placeholder=" " required /><label className="input-label">Nama Paket</label></div>
                        <div className="input-group"><input type="number" name="price" value={packageFormData.price} onChange={handlePackageInputChange} className="input-field" placeholder=" " required /><label className="input-label">Harga (IDR)</label></div>
                    </div>
                     <div className="input-group">
                        <select name="category" value={packageFormData.category} onChange={handlePackageInputChange} className="input-field" required>
                            <option value="">Pilih kategori...</option>
                            {profile.packageCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <label className="input-label">Kategori</label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="input-group"><input type="text" name="processingTime" value={packageFormData.processingTime} onChange={handlePackageInputChange} className="input-field" placeholder=" "/><label className="input-label">Waktu Pengerjaan</label></div>
                        <div className="input-group"><input type="text" name="photographers" value={packageFormData.photographers} onChange={handlePackageInputChange} className="input-field" placeholder=" "/><label className="input-label">Jumlah Fotografer</label></div>
                        <div className="input-group"><input type="text" name="videographers" value={packageFormData.videographers} onChange={handlePackageInputChange} className="input-field" placeholder=" "/><label className="input-label">Jumlah Videografer</label></div>
                    </div>
                    
                    <div className="input-group"><label className="input-label !static !-top-4 !text-brand-accent">Cover Image</label><input type="file" onChange={handleCoverImageChange} className="input-field" accept="image/*" /></div>
                    
                    <div className="pt-2"><h4 className="font-semibold text-brand-text-light">Item Digital</h4>{packageFormData.digitalItems.map((item: string, index: number) => (<div key={index} className="flex items-center gap-2 mt-1"><input type="text" value={item} onChange={e => handleDigitalItemChange(index, e)} className="input-field flex-grow" /><button type="button" onClick={() => removeDigitalItem(index)} className="p-2 text-brand-danger"><Trash2Icon className="w-4 h-4"/></button></div>))}<button type="button" onClick={addDigitalItem} className="text-sm font-semibold text-brand-accent mt-2">+ Tambah Item</button></div>
                    <div className="pt-2"><h4 className="font-semibold text-brand-text-light">Item Fisik</h4>{packageFormData.physicalItems.map((item: {name: string, price: string|number}, index: number) => (<div key={index} className="flex items-center gap-2 mt-1"><input type="text" name="name" value={item.name} onChange={e => handlePhysicalItemChange(index, e)} className="input-field flex-grow" placeholder="Nama Item" /><input type="number" name="price" value={item.price} onChange={e => handlePhysicalItemChange(index, e)} className="input-field w-32" placeholder="Harga" /><button type="button" onClick={() => removePhysicalItem(index)} className="p-2 text-brand-danger"><Trash2Icon className="w-4 h-4"/></button></div>))}<button type="button" onClick={addPhysicalItem} className="text-sm font-semibold text-brand-accent mt-2">+ Tambah Item</button></div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-brand-border"><button type="button" onClick={handlePackageCancelEdit} className="button-secondary">Batal</button><button type="submit" className="button-primary">{packageEditMode === 'new' ? 'Simpan' : 'Update'}</button></div>
                </form>
            </Modal>

            <Modal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} title="Bagikan Halaman Paket Publik">
                <p className="text-sm text-brand-text-secondary mb-4">Bagikan tautan ini kepada calon klien untuk melihat semua paket yang Anda tawarkan.</p>
                <div className="input-group"><input type="text" readOnly value={publicPackagesUrl} className="input-field !bg-brand-input" /><label className="input-label">Tautan Publik</label></div>
                <div className="text-right mt-4"><button onClick={copyPackagesLinkToClipboard} className="button-primary">Salin Tautan</button></div>
            </Modal>
            
            <Modal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} title="Panduan Halaman Paket">
                <div className="space-y-4 text-sm text-brand-text-primary">
                    <p>Halaman ini adalah tempat Anda membuat dan mengelola semua penawaran produk Anda.</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>Paket:</strong> Kolom utama di kiri menampilkan semua paket layanan Anda, dikelompokkan berdasarkan kategori. Anda dapat menambah, mengedit, atau menghapus paket.</li>
                        <li><strong>Add-Ons:</strong> Kolom di kanan adalah untuk item tambahan yang bisa dipilih klien, seperti drone, MUA, dll.</li>
                        <li><strong>Cover Image:</strong> Anda bisa menambahkan gambar sampul untuk setiap paket agar lebih menarik secara visual di halaman publik.</li>
                        <li><strong>Bagikan Halaman Paket:</strong> Gunakan tombol di kanan atas untuk mendapatkan tautan ke halaman publik yang menampilkan semua paket Anda, siap untuk dibagikan kepada calon klien.</li>
                        <li><strong>Kategori:</strong> Kategori untuk paket dapat dikelola di halaman <strong>Pengaturan &gt; Kustomisasi Kategori</strong>.</li>
                    </ul>
                </div>
            </Modal>
        </div>
    );
};

export default Packages;
