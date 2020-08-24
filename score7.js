(function() {
	/**
	 * General purpose registers, plus a few others
	 * @type {Array.<string>}
	 */
	const _score7_registers = [
		"r0", "r1", "r2", "r3",
		"r4", "r5", "r6", "r7",
		"r8", "r9", "r10", "r11",
		"r12", "r13", "r14", "r15",
		"r16", "r17", "r18", "r19",
		"r20", "r21", "r22", "r23",
		"r24", "r25", "r26", "r27",
		"r28", "r29", "r30", "r31"
    ];

    const Base = require('libdec/core/base');
    const Variable = require('libdec/core/variable');
    const Extra = require('libdec/core/extra');
    return {
        instructions: {
            add: function(instr, context, instructions) {
                return Base.add(instr.parsed.opd[0], instr.parsed.opd[1], instr.parsed.opd[2]);
            },
            nop: function() {
                return Base.nop();
            },
			ldis: function(instr, context, instructions) {
				shl = [instr.parsed.opd[1], "<<", "0x10"].join(" ");
				return Base.assign(instr.parsed.opd[0], shl);
			},
			ori: function(instr, context, instructions) {
				return Base.or(instr.parsed.opd[0], instr.parsed.opd[0], instr.parsed.opd[1]);
			},
			jl: function(instr, context, instructions) {
				return Base.call(instr.parsed.opd[0]);
			},
			b: function(instr, context, instructions) {
				return Base.goto(instr.parsed.opd[0]);
			},
			push: function(instr, context, instructions) {
				instr.valid = false;
				var val = instr.parsed.opd[0];
				return val.mem_access ?
					Variable.pointer(val.token, Extra.to.type(val.mem_access, false)) :
					val.token;
			},
			"mv!": function(instr, context, instructions) {
				return Base.assign(instr.parsed.opd[0], instr.parsed.opd[1]);
			},
			sw: function(instr, context, instructions) {
				loc = [instr.parsed.opd[1], "+", instr.parsed.opd[2]].join(" ");
				return Base.write_memory(loc, instr.parsed.opd[0], 32, true);
			},
			addi: function(instr, context, instructions) {
				return Base.add(instr.parsed.opd[0], instr.parsed.opd[0], instr.parsed.opd[1]);
			},
			"swp!": function(instr, context, instructions) {
				loc = [_score7_registers[2], "+", "(", instr.parsed.opd[1], "<<", 2, ")"].join(" ");
				//loc = "69"
				return Base.write_memory(loc, instr.parsed.opd[0], 32, true);
			},
            invalid: function(instr, context, instructions) {
                return Base.nop();
            }
        },
        parse: function(assembly) {
            var tokens = assembly.trim().replace(/,/g,"").split(' ');
            return { mnem: tokens.shift(), opd: tokens };
        },
        context: function() {
            return { cond: { a: '?', b: '?' } };
        },
        preanalisys: function(instructions, context) {},
        postanalisys: function(instructions, context) {},
        localvars: function(context) {
            return [];
        },
        globalvars: function(context) {
            return [];
        },
        arguments: function(context) {
            return [];
        },
        returns: function(context) {
            return 'void';
        }
    };
});
