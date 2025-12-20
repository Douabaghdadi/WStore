"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const deleteUser = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" });
      fetchUsers();
    }
  };

  return (
    <div className="container-scroller">
      <Navbar />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title">Utilisateurs</h3>
              <Link href="/admin/users/new" className="btn btn-primary btn-sm">
                <i className="mdi mdi-plus"></i> Ajouter un utilisateur
              </Link>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user: any) => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <label className={`badge badge-${user.role === 'admin' ? 'danger' : 'info'}`}>
                              {user.role}
                            </label>
                          </td>
                          <td>
                            <Link href={`/admin/users/${user._id}`} className="btn btn-warning btn-sm me-2">
                              <i className="mdi mdi-pencil"></i>
                            </Link>
                            <button onClick={() => deleteUser(user._id)} className="btn btn-danger btn-sm">
                              <i className="mdi mdi-delete"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
