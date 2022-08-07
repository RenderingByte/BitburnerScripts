// Made by Byte.

// BECAUSE OF THE NATURE OF THIS SCRIPT
// IT IS STRONGLY SUGGESTED TO NOT RUN
// ANY OTHER SCRIPTS WHILE THIS ONE IS
// RUNNING BECAUSE THOSE SCRIPTS WILL
// NOT RUN AS INTENDED BY THE USER/DEV.

/** @param {NS} ns */
export async function main(ns) {
	
    // RAM Bypass (m0dar)
    function ramExploit(ns, method, ...args) {
        const call = () => eval("ns." + method)(...args);
        try {
            return call();
        } catch {
            return call();
        }
    }
    const _ns = (...args) => ramExploit(ns, ...args);

    // Script Name
    var script_name = "ByteScript.js";

    // Script Caller (hostname)
    var script_caller = ns.args[0];
    if (ns.args.length == 0) { script_caller = null; }

    // Current Server Hostname
    var currenthostname = _ns("getServer").hostname;

    // Notify
    _ns("tprint", "RUNNING ON " + currenthostname);

    // Just Ran Script
    var first_iter = true;

    while (true)
    {
        if (first_iter)
        {
            var scan = _ns("scan");
            for (var i = 0; i < scan.length; i++)
            {
                var hostname = scan[i];

                // Not enough ports? No problem.
                if (_ns("hasRootAccess", hostname) == false)
                {
                    var can_open_ports = 0;
                    
                    if (_ns("fileExists", "BruteSSH.exe", "home")) { can_open_ports++; await _ns("brutessh", hostname); }
                    if (_ns("fileExists", "FTPCrack.exe", "home")) { can_open_ports++; await _ns("ftpcrack", hostname); }
                    if (_ns("fileExists", "relaySMTP.exe", "home")) { can_open_ports++; await _ns("relaysmtp", hostname); }
                    if (_ns("fileExists", "HTTPWorm.exe", "home")) { can_open_ports++; await _ns("httpworm", hostname); }
                    if (_ns("fileExists", "SQLInject.exe", "home")) { can_open_ports++; await _ns("sqlinject", hostname); }

                    // Attempt To Get Root Access
                    if (_ns("getServerNumPortsRequired", hostname) <= can_open_ports) { await _ns("nuke", hostname); }
                    else { _ns("tprint", "NOT ENOUGH PORTS TO NUKE " + hostname + " (" + can_open_ports + "/" + _ns("getServerNumPortsRequired", hostname) + ")"); }
                }

                // Self Propogate.
                if (_ns("hasRootAccess", hostname))
                {
                    // Do not enter inf propogation loop or propogate to home.
                    if (script_caller == hostname || hostname == "home") { continue; }

                    // If script already exists on that host, delete it to run the updated copy.
                    if (_ns("fileExists", script_name, hostname)) { await _ns("killall", hostname); await _ns("rm", script_name, hostname); }

                    // Get Max Threads
                    var max_threads = 1000
                    for (var t = max_threads; t > -1; t--)
                    {
                        if (_ns("getServerUsedRam", hostname) + (_ns("getScriptRam", script_name) * t) <= _ns("getServerMaxRam", hostname))
                        {
                            max_threads = t;
                            break;
                        }
                    }
                    if (max_threads == 0) { _ns("tprint", "Cannot run on " + hostname + " because max_threads = 0"); continue; }
                    
                    // Override scripts with this updated one
                    await _ns("scp", script_name, currenthostname, hostname);
                    await _ns("exec", script_name, hostname, max_threads, currenthostname);
                }
            }
            first_iter = false;
        }

        // If hack is not possible, then exit...
        if (_ns("getHackingLevel") < _ns("getServerRequiredHackingLevel", currenthostname)) { _ns("exit"); }

        // Adjust settings
        var moneyThresh = _ns("getServerMaxMoney", currenthostname) * 0.8; // 80% of max money
        var securityThresh = _ns("getServerMinSecurityLevel", currenthostname) + 5; // minsec + 5

        // Hack.
        if (currenthostname != "home")
        {
            if (_ns("getServerSecurityLevel", currenthostname) > securityThresh) {
                await _ns("weaken", currenthostname);
            } else if (_ns("getServerMoneyAvailable", currenthostname) < moneyThresh) {
                await _ns("grow", currenthostname);
            } else {
                await _ns("hack", currenthostname);
            }
        }
        else { _ns("tprint", "Terminating on home since home should not be self-hacked."); _ns("exit"); }
        await _ns("sleep", 25);
    }
}
