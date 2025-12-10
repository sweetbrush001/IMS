import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function GemModal({ gem, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '', carat_weight: 0, color: '', price: 0, origin: '', certification_id: ''
    });

    useEffect(() => {
        if (gem) {
            setFormData({
                name: gem.name,
                carat_weight: gem.carat_weight,
                color: gem.color,
                price: gem.price,
                origin: gem.origin,
                certification_id: gem.certification_id
            });
        }
    }, [gem]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ensure numbers are numbers
            const payload = {
                ...formData,
                carat_weight: parseFloat(formData.carat_weight),
                price: parseFloat(formData.price)
            };

            if (gem) {
                await api.put(`/inventory/${gem.id}`, payload);
            } else {
                await api.post('/inventory', payload);
            }
            onSave();
            onClose();
        } catch (error) {
            alert('Error saving gem: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{gem ? 'Edit Gem' : 'Add Gem'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label>Name</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                    <div className="form-group"><label>Carat Weight</label><input type="number" step="0.01" value={formData.carat_weight} onChange={e => setFormData({ ...formData, carat_weight: e.target.value })} required /></div>
                    <div className="form-group"><label>Color</label><input value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} required /></div>
                    <div className="form-group"><label>Price</label><input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required /></div>
                    <div className="form-group"><label>Origin</label><input value={formData.origin} onChange={e => setFormData({ ...formData, origin: e.target.value })} required /></div>
                    <div className="form-group"><label>Cert ID</label><input value={formData.certification_id} onChange={e => setFormData({ ...formData, certification_id: e.target.value })} required /></div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
