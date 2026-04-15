function ok(res, data) {
  return res.json({ ok: true, data });
}

function fail(res, status, message) {
  return res.status(status).json({ ok: false, message });
}

module.exports = { ok, fail };

