import json, pathlib
root=pathlib.Path(__file__).resolve().parent
passages=json.loads((root/"data/passages.json").read_text(encoding="utf-8"))
tests=json.loads((root/"data/tests.json").read_text(encoding="utf-8"))
assert len(passages)>=3000, len(passages)
assert len(tests)==100, len(tests)
ids={p["id"] for p in passages}
assert len(ids)==len(passages)
for t in tests:
    assert len(t["passages"])==3
    assert t["distribution"]==[13,13,14]
    assert sum(t["distribution"])==40
    assert all(pid in ids for pid in t["passages"])
print("PASS: 3000+ passages")
print("PASS: 100 teaching tests")
print("PASS: every test = 3 passages / 40 questions / 13+13+14")
