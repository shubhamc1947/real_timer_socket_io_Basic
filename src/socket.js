import { io } from 'socket.io-client';

export const socket = io("http://localhost:3000/")

// export const initSocket = async () => {
//     const options = {
//         'force new connection': true,
//         reconnectionAttempt: 'Infinity',
//         timeout: 10000,
//         transports: ['websocket'],
//     };
//     return io(import.meta.env.VITE_APP_BACKEND_URL, options);
// };
