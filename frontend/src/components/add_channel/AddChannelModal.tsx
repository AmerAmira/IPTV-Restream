import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import socketService from '../../services/SocketService';
import { CustomHeader } from '../../types';
import CustomHeaderInput from './CustomHeaderInput';

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddChannelModal({ isOpen, onClose }: AddChannelModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [avatar, setAvatar] = useState('');
  const [restream, setRestream] = useState(false);
  const [headers, setHeaders] = useState<CustomHeader[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    socketService.addChannel(
      name.trim(), 
      url.trim(), 
      avatar.trim() || 'https://via.placeholder.com/64', 
      restream,
      JSON.stringify(headers)
    );

    setName('');
    setUrl('');
    setAvatar('');
    onClose();
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    setHeaders(newHeaders);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Add New Channel</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Channel Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter channel name"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-1">
              Stream URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter stream URL"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-1">
              Avatar URL
            </label>
            <input
              type="url"
              id="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter channel avatar URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Restream through backend</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="restream"
                  value="yes"
                  checked={restream}
                  className="form-radio text-blue-600"
                  onChange={() => setRestream(true)}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="restream"
                  value="no"
                  className="form-radio text-blue-600"
                  checked={!restream}
                  onChange={() => setRestream(false)}
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

          {restream && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">
                  Custom Headers
                </label>
                <button
                  type="button"
                  onClick={addHeader}
                  className="flex items-center space-x-1 text-sm text-blue-400 hover:text-blue-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Header</span>
                </button>
              </div>
              <div className="space-y-2">
                {headers.map((header, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CustomHeaderInput
                      header={header}
                      onKeyChange={(value) => updateHeader(index, 'key', value)}
                      onValueChange={(value) => updateHeader(index, 'value', value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeHeader(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Channel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddChannelModal;