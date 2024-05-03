import React, { useContext } from "react"

/**
 * Process contexts before returning them
 * @param {React.context<any>} ctx 
 * @returns The context provided
 */
const contextProcess = (context) => {
    const ctx = useContext(context);

    if (!ctx) {
        const error = new Error();
        const stack = error.stack || '';
        const hookName = stack.split('\n')[2].match(/at (\w+)/)[1];
        throw new Error(`${hookName} must be used within ${context.displayName || 'the corresponding provider'}`);
    }

    return ctx;
}

export default contextProcess;