// frontend/src/pages/admin/CreateInvitePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const CreateInvitePage = () => {
  const { user, createInviteCode, getInviteCodes, deleteInviteCode } = useAuth();
  const [note, setNote] = useState('');
  const [newCode, setNewCode] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCreateCode = () => {
    try {
      const createdCode = createInviteCode(note);
      setNewCode(createdCode);
      setMessage(`¡Código creado: ${createdCode.code}`);
      setNote('');
      setError('');
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  const handleDeleteCode = (code) => {
    if (window.confirm(`¿Eliminar código ${code}?`)) {
      try {
        deleteInviteCode(code);
        setMessage(`Código ${code} eliminado`);
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  const allInviteCodes = getInviteCodes();

  if (user?.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-red-800 mb-2">Acceso Denegado</h2>
            <p className="text-red-600">Solo el superadministrador puede acceder a esta página.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Generador de Códigos de Invitación</h1>
          <p className="text-gray-600 mt-2">Genera códigos únicos para invitar administradores al sistema</p>
        </div>

        {/* Formulario para crear código */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Crear Nuevo Código</h2>
          
          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-700">{message}</p>
              {newCode && (
                <div className="mt-2 p-3 bg-green-100 rounded">
                  <p className="font-mono text-lg font-bold">{newCode.code}</p>
                  <p className="text-sm text-green-600 mt-1">
                    Expira: {formatDate(newCode.expiresAt)}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Nota (opcional):
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej: Para el nuevo administrador regional"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-gray-500 text-sm mt-1">Describe para quién es este código</p>
          </div>

          <button
            onClick={handleCreateCode}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            Generar Código de Invitación
          </button>
        </div>

        {/* Lista de códigos existentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Códigos Generados</h2>
          
          {allInviteCodes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay códigos generados aún</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creado por
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nota
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiración
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allInviteCodes.map((code) => (
                    <tr key={code.code} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {code.code}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        {code.used ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Usado
                          </span>
                        ) : isExpired(code.expiresAt) ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Expirado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Activo
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {code.createdByName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {code.note || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatDate(code.expiresAt)}
                      </td>
                      <td className="px-4 py-3">
                        {!code.used && (
                          <button
                            onClick={() => handleDeleteCode(code.code)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Eliminar
                          </button>
                        )}
                        {code.used && (
                          <span className="text-sm text-gray-500">
                            Usado por: {code.usedBy}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Instrucciones - FIJATE QUE ELIMINÉ LA REFERENCIA A INVITE_CODE_EXPIRY_DAYS */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">¿Cómo funcionan los códigos?</h3>
          <ul className="list-disc pl-5 text-blue-700 space-y-1">
            <li>Los códigos son válidos por 30 días</li>
            <li>Cada código solo puede usarse una vez</li>
            <li>Al registrarse con un código válido, el usuario obtiene rol de "admin"</li>
            <li>Sin código, el registro crea usuarios normales (rol "user")</li>
            <li>Los códigos expirados o usados no pueden reutilizarse</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateInvitePage;