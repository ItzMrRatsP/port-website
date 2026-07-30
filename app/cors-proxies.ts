// Shared CORS proxy list + fetch logic, used by ccuFrame, gamejam-icon,
// and game-thumbnail so there's a single place to update proxies.
//
// Source: https://github.com/distribuyed/proxies (to-do list + comparison table).
// Every URL from that page that is actually a fetchable endpoint is below,
// ordered roughly best-to-worst so the retry loop burns time on the good
// ones first. Each entry is commented with what's known about it from the
// source list itself — several of these WILL throw at runtime (dead host,
// JSONP-wrapped response `res.json()` can't parse, wrong HTTP method,
// etc.) but they're left in per your request. The loop in
// fetchThroughProxy() just moves on when one throws or times out.
//
// NOT included below — these were links in the repo but aren't proxy
// endpoints at all (source-code repos, doc pages, a testing tool, or
// JSFiddle demos), so there's no URL to put in a fetch call:
//   - github.com/Rob--W/cors-anywhere        (source for cors-anywhere.herokuapp.com, below)
//   - corsproxy.github.io                    (info page)
//   - codetabs.com/cors-proxy/cors-proxy.html (docs page, not the API — api.codetabs.com below is the real endpoint)
//   - walac.github.io/cors-proxy             (docs for cors-proxy.taskcluster.net, below)
//   - github.com/ripper234/Whatever-Origin   (source for whateverorigin.org, below)
//   - github.com/okfn/gobetween              (source for gobetween.oklabs.org, below)
//   - github.com/acidsound/goxcors           (source for goxcors.appspot.com, below)
//   - github.com/Zibri/cloudflare-cors-anywhere (self-hosted Worker template, not a public URL — this is what I'd actually recommend deploying yourself, per our earlier chat)
//   - test-cors.org                          (a CORS *testing* tool, not a proxy)
//   - jsfiddle.net/1d8cwqo0/1 and /Ln47kyt2/3 (JSFiddle demos, not endpoints)
export const PROXIES: ((url: string) => string)[] = [
	// --- Known working (plain GET, raw passthrough) ---
	(url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
	(url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
	(url) => `https://thingproxy.freeboard.io/fetch/${url}`, // capped ~10 req/sec, 100kb

	// --- Unverified but plausible (raw/GET per the source list) ---
	(url) => `https://yacdn.org/proxy/${url}`, // "not mirrored" status in source list
	(url) => `http://www.corsproxy.com/${url}`, // http only per source

	// --- JSONP or wrapped-response — `res.json()` will very likely throw ---
	(url) => `http://www.whateverorigin.org/get?url=${encodeURIComponent(url)}`, // wraps result in {contents:...}, not raw
	(url) => `https://jsonp.afeld.me/?callback=&url=${encodeURIComponent(url)}`, // JSONP
	(url) => `http://anyorigin.com/go/?url=${encodeURIComponent(url)}`, // JSONP per source table

	// --- Wrong method / gated access — will fail as used here ---
	(url) => `http://goxcors.appspot.com/${encodeURIComponent(url)}`, // source notes POST/x-www-form-urlencoded only
	(url) => `https://cors-anywhere.herokuapp.com/${url}`, // demo instance requires manually requesting temp access in a browser first
	(url) => `https://cors-proxy.taskcluster.net/${encodeURIComponent(url)}`, // source notes "only whitelisted for taskcluster"

	// --- Small/personal hosts, alive status unknown ---
	(url) => `https://cors-proxy.htmldriven.com/?url=${encodeURIComponent(url)}`,
	(url) => `https://cors.io/${url}`,
	(url) => `https://corsproxy.our.buildo.io/${url}`,
	(url) => `http://www.corsify.me/${url}`,
	(url) => `http://gobetween.oklabs.org/pipe/${encodeURIComponent(url)}`,
	(url) => `http://cors.hyoo.ru/${url}`,
	(url) => `http://corsy.rs.af.cm/?get=${encodeURIComponent(url)}`,
	(url) => `https://crossproxy.me/${url}`,
	(url) => `https://test.cors.workers.dev/${url}`, // a Cloudflare CORS *test* worker, not meant as a general proxy — kept since it was in the list

	// --- Almost certainly dead: free-tier platforms that were shut down or deprecated ---
	(url) => `https://crossorigin.me/${url}`, // shut down 2016
	(url) => `http://coin-toss.herokuapp.com/${encodeURIComponent(url)}`, // Heroku free dynos killed Nov 2022
	(url) => `http://dry-sierra-94326.herokuapp.com/${encodeURIComponent(url)}`,
	(url) => `https://free-cors-proxy.herokuapp.com/${encodeURIComponent(url)}`,
	(url) => `https://galvanize-cors-proxy.herokuapp.com/${encodeURIComponent(url)}`,
	(url) => `http://jsonp.herokuapp.com/${encodeURIComponent(url)}`, // also JSONP
	(url) => `https://universal-cors-proxy.glitch.me/${url}`, // Glitch killed free community projects in 2024
	(url) => `https://proxy-sauce.glitch.me/${url}`,
	(url) => `https://cors.now.sh/${url}`, // now.sh retired ~2020
	(url) => `https://cors-buster.now.sh/?href=${encodeURIComponent(url)}`,
	(url) => `https://cors4js.appspot.com/?url=${encodeURIComponent(url)}`, // legacy App Engine app, likely decommissioned

	// --- Security note, disabled by default ---
	// This one was in the source list, but I wouldn't route real API
	// traffic through an unknown operator on a domain like this without
	// you deciding that deliberately. Uncomment to enable:
	// (url) => `http://fuck-cors.com/?url=${encodeURIComponent(url)}`,
];

export const PROXY_TIMEOUT_MS = 6000;
export const LAST_GOOD_PROXY_KEY = "lastGoodProxyIndex";

// Try whichever proxy last worked first, instead of always starting from
// the top of the list and re-discovering the same outage every request.
export function getPreferredOrder(): number[] {
	let preferred = 0;
	try {
		const stored = localStorage.getItem(LAST_GOOD_PROXY_KEY);
		if (stored) preferred = Number(stored) || 0;
	} catch {}
	const order = PROXIES.map((_, i) => i);
	if (preferred > 0 && preferred < order.length) {
		order.splice(order.indexOf(preferred), 1);
		order.unshift(preferred);
	}
	return order;
}

export function rememberGoodProxy(index: number) {
	try {
		localStorage.setItem(LAST_GOOD_PROXY_KEY, String(index));
	} catch {}
}

export function withTimeout(ms: number, signal?: AbortSignal) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), ms);
	if (signal) {
		if (signal.aborted) controller.abort();
		else signal.addEventListener("abort", () => controller.abort(), { once: true });
	}
	return { signal: controller.signal, cancel: () => clearTimeout(timeoutId) };
}

// Tries each proxy in preferred order, with a per-request timeout so a
// proxy that hangs (rather than fails fast) doesn't stall the chain.
export async function fetchThroughProxy(targetUrl: string, signal?: AbortSignal) {
	let lastError: unknown;
	for (const index of getPreferredOrder()) {
		const { signal: timedSignal, cancel } = withTimeout(PROXY_TIMEOUT_MS, signal);
		try {
			const res = await fetch(PROXIES[index](targetUrl), { signal: timedSignal });
			if (!res.ok) throw new Error(`Proxy request failed: ${res.status}`);
			const json = await res.json();
			rememberGoodProxy(index);
			return json;
		} catch (err) {
			if (signal?.aborted) throw err;
			lastError = err;
		} finally {
			cancel();
		}
	}
	throw lastError instanceof Error ? lastError : new Error("All proxies failed");
}
