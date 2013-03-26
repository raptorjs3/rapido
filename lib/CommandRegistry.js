var Stack = require('./Stack');

function CommandRegistry() {
    this.stacksByName = {};
    this.commandsByName = {};

    this.registerStack('default', {
        description: 'Default commands'
    });
}

CommandRegistry.prototype = {
    registerStack: function(stackName, stackConfig) {
        var stack = this.stacksByName[stackName] || (this.stacksByName[stackName] = new Stack(stackName));
        if (stackConfig.description) {
            stack.description = stackConfig.description;
        }
    },

    registerCommand: function(stackName, commandName, commandConfig) {
        if (!stackName) {
            throw new Error('Stack name is required');
        }

        if (!commandName) {
            throw new Error('Command name is required');
        }

        // Find the stack instance that this command will be added to
        var stack = this.stacksByName[stackName] || (this.stacksByName[stackName] = new Stack(stackName));
        commandConfig.stack = stack;
        stack.registerCommand(commandName, commandConfig);
    },

    getCommand: function(stackName, commandName) {
        var stack = this.stacksByName[stackName];
        if (!stack) {
            throw new Error('Stack not found with name "' + stackname + '"');
        }
        return stack.getCommand(commandName);
    },

    getStack: function(stackName) {
        return this.stacksByName[stackName];
    },

    getStacks: function() {
        var stacks = [];
        require('raptor').forEachEntry(
            this.stacksByName, 
            function(stackName, stack) {
                stacks.push(stack);
            });

        stacks.sort(function(a, b) {
            a = a.name.toLowerCase();
            b = b.name.toLowerCase();
            if (a === 'default') {
                return -1;
            }
            if (b === 'default') {
                return 1;
            }

            return a < b ? -1 : (a === b ? 0 : 1);
        });

        return stacks;
    },

    toString: function() {
        var output = "";
        this.getStacks().forEach(function(stack) {
            output += stack.toString() + '\n';
        });
        return output;
    }
}

module.exports = CommandRegistry;