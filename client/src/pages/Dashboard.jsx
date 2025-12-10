import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import GemModal from '../components/GemModal';

export default function Dashboard() {
    const [gems, setGems] = useState([]);
    const [filters, setFilters] = useState({ color: '', origin: '', minPrice: '', maxPrice: '' });
    const [showModal, setShowModal] = useState(false);
    const [editingGem, setEditingGem] = useState(null);
    const { user, logout } = useAuth();

    const fetchGems = async () => {
        try {
            const { data } = await api.get('/inventory', { params: filters });
            setGems(data);
        } catch (error) {
            console.error('Failed to fetch gems', error);
        }
    };

    useEffect(() => {
        fetchGems();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/inventory/${id}`);
            fetchGems();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Inventory Dashboard</h1>
                <div className="user-controls">
                    <span>Welcome, {user?.username} ({user?.role})</span>
                    <button onClick={logout} className="btn-secondary">Logout</button>
                </div>
            </header>

            <div className="controls-bar">
                <div className="filters">
                    <input placeholder="Color" onChange={e => setFilters({ ...filters, color: e.target.value })} />
                    <input placeholder="Origin" onChange={e => setFilters({ ...filters, origin: e.target.value })} />
                    <input type="number" placeholder="Min Price" onChange={e => setFilters({ ...filters, minPrice: e.target.value })} />
                    <input type="number" placeholder="Max Price" onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} />
                    <button onClick={fetchGems} className="btn-primary">Search</button>
                </div>
                {user?.role === 'ADMIN' || user?.role === 'STAFF' ? (
                    <button onClick={() => { setEditingGem(null); setShowModal(true); }} className="btn-add">
                        + Add Gem
                    </button>
                ) : null}
            </div>

            <table className="gem-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Weight (ct)</th>
                        <th>Color</th>
                        <th>Origin</th>
                        <th>Price</th>
                        <th>Cert ID</th>
                        {user?.role === 'ADMIN' && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {gems.map(gem => (
                        <tr key={gem.id}>
                            <td>{gem.name}</td>
                            <td>{gem.carat_weight}</td>
                            <td>{gem.color}</td>
                            <td>{gem.origin}</td>
                            <td>${gem.price}</td>
                            <td>{gem.certification_id}</td>
                            {user?.role === 'ADMIN' && (
                                <td>
                                    <button onClick={() => { setEditingGem(gem); setShowModal(true); }} className="btn-icon">✏️</button>
                                    <button onClick={() => handleDelete(gem.id)} className="btn-icon delete">🗑️</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <GemModal
                    gem={editingGem}
                    onClose={() => setShowModal(false)}
                    onSave={fetchGems}
                />
            )}
        </div>
    );
}
