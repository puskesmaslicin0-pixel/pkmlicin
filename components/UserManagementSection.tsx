
import React, { useState } from 'react';
import { Users, Plus, Trash2, Key, User, Save, X } from 'lucide-react';
import { User as UserType } from '../types';

interface UserManagementSectionProps {
  users: UserType[];
  onUpdateUsers: (users: UserType[]) => void;
  currentUser: UserType | null;
}

const UserManagementSection: React.FC<UserManagementSectionProps> = ({ users, onUpdateUsers, currentUser }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingPasswordId, setEditingPasswordId] = useState<string | null>(null);
  
  // New User Form State
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '' });
  
  // Change Password State
  const [newPassword, setNewPassword] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.username || !newUser.password) return;

    const userToAdd: UserType = {
      id: Date.now().toString(),
      name: newUser.name,
      username: newUser.username,
      password: newUser.password,
      role: 'editor' // Default role
    };

    onUpdateUsers([...users, userToAdd]);
    setNewUser({ name: '', username: '', password: '' });
    setIsAdding(false);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      onUpdateUsers(users.filter(u => u.id !== id));
    }
  };

  const handleChangePassword = (id: string) => {
    if (!newPassword) return;
    const updatedUsers = users.map(u => {
      if (u.id === id) {
        return { ...u, password: newPassword };
      }
      return u;
    });
    onUpdateUsers(updatedUsers);
    setEditingPasswordId(null);
    setNewPassword('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center">
            <Users className="mr-2 text-teal-600" /> Manajemen Pengguna
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Kelola akses pengguna, tambah admin baru, dan atur ulang kata sandi.
          </p>
        </div>
      </div>

      <div className="p-6">
        {/* Add User Toggle */}
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="mb-6 flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" /> Tambah User Baru
          </button>
        ) : (
          <form onSubmit={handleAddUser} className="mb-8 bg-slate-50 p-6 rounded-xl border border-teal-100">
             <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-800">Tambah Pengguna</h4>
                <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                   <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                   <input 
                      type="text" 
                      required
                      className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                      value={newUser.name}
                      onChange={e => setNewUser({...newUser, name: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
                   <input 
                      type="text" 
                      required
                      className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                      value={newUser.username}
                      onChange={e => setNewUser({...newUser, username: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                   <input 
                      type="password" 
                      required
                      className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                      value={newUser.password}
                      onChange={e => setNewUser({...newUser, password: e.target.value})}
                   />
                </div>
             </div>
             <div className="mt-4 flex justify-end">
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">Simpan User</button>
             </div>
          </form>
        )}

        {/* User Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                       <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mr-3">
                          <User className="h-4 w-4" />
                       </div>
                       <span className="text-sm font-medium text-slate-900">{user.name}</span>
                       {currentUser?.id === user.id && (
                         <span className="ml-2 px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700 font-bold">Anda</span>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <span className="capitalize bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">{user.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingPasswordId === user.id ? (
                      <div className="flex items-center justify-end space-x-2">
                         <input 
                            type="text" 
                            placeholder="Password Baru" 
                            className="w-32 text-xs border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                         />
                         <button onClick={() => handleChangePassword(user.id)} className="text-green-600 hover:text-green-800" title="Simpan"><Save className="h-4 w-4" /></button>
                         <button onClick={() => { setEditingPasswordId(null); setNewPassword(''); }} className="text-slate-400 hover:text-slate-600" title="Batal"><X className="h-4 w-4" /></button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-3">
                        <button 
                           onClick={() => { setEditingPasswordId(user.id); setNewPassword(''); }} 
                           className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        >
                          <Key className="h-4 w-4 mr-1" /> <span className="text-xs">Ubah Pass</span>
                        </button>
                        
                        {/* Prevent deleting yourself or if there is only 1 user */}
                        {currentUser?.id !== user.id && users.length > 1 && (
                          <button 
                             onClick={() => handleDeleteUser(user.id)} 
                             className="text-red-600 hover:text-red-900"
                             title="Hapus User"
                          >
                             <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementSection;
