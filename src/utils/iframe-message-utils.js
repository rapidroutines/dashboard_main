/**
 * Utility functions for iframe message handling
 */

/**
 * Send a message to an iframe
 * @param {HTMLIFrameElement} iframe - The iframe element to send the message to
 * @param {string} messageType - The type of message
 * @param {object} data - The data to send
 */
export const sendMessageToIframe = (iframe, messageType, data = {}) => {
    if (!iframe || !iframe.contentWindow) {
      console.warn('No valid iframe provided to send message to');
      return;
    }
    
    try {
      iframe.contentWindow.postMessage({
        type: messageType,
        ...data
      }, '*');  // Using * for development, should be more specific in production
    } catch (error) {
      console.error('Error sending message to iframe:', error);
    }
  };
  
  /**
   * Create a message handler for iframe messages
   * @param {array} allowedOrigins - The allowed origins for messages
   * @param {object} handlers - Object with message type handlers
   * @returns {function} - The message handler function
   */
  export const createIframeMessageHandler = (allowedOrigins, handlers) => {
    return (event) => {
      // Check if the origin is allowed
      if (allowedOrigins.length > 0 && !allowedOrigins.includes(event.origin)) {
        return;
      }
      
      // Check if the event has data and a type
      if (!event.data || !event.data.type) {
        return;
      }
      
      // Call the appropriate handler
      const handler = handlers[event.data.type];
      if (handler && typeof handler === 'function') {
        handler(event.data, event);
      }
    };
  };