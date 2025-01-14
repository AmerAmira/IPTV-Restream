const ChannelService = require('../services/ChannelService');

module.exports = (io, socket) => {

    socket.on('add-channel', ({ name, url, avatar, restream, headersJson}) => {
        try {
            const newChannel = ChannelService.addChannel(name, url, avatar, restream, headersJson);
            io.emit('channel-added', newChannel); // Broadcast to all clients
        } catch (err) {
            socket.emit('app-error', { message: err.message });
        }
    });


    socket.on('set-current-channel', (id) => {
        try {
            const nextChannel = ChannelService.setCurrentChannel(id);
            io.emit('channel-selected', nextChannel); // Broadcast to all clients
        } catch (err) {
            console.error(err);
            socket.emit('app-error', { message: err.message });
        }
    });
};
