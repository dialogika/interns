import assert from "node:assert/strict";
import {
    normalizeEmail,
    buildInternsScreeningEmailQueries,
    pickOnboardingCandidate,
    mapInternsScreeningCandidate
} from "../element/register-candidate-lookup.js";

function runTest(name, fn) {
    try {
        fn();
        console.log("[PASS]", name);
    } catch (error) {
        console.error("[FAIL]", name);
        throw error;
    }
}

runTest("normalizeEmail menormalkan input email", () => {
    assert.equal(normalizeEmail("  USER@Email.Com "), "user@email.com");
});

runTest("buildInternsScreeningEmailQueries hanya menggunakan collection interns_screening", () => {
    const collectionCalls = [];
    const whereCalls = [];
    const queryCalls = [];

    const collection = (_db, name) => {
        collectionCalls.push(name);
        return { type: "collection", name };
    };
    const where = (field, op, value) => {
        whereCalls.push({ field, op, value });
        return { type: "where", field, op, value };
    };
    const limit = (n) => ({ type: "limit", value: n });
    const query = (...args) => {
        queryCalls.push(args);
        return { type: "query", args };
    };

    const queries = buildInternsScreeningEmailQueries({
        db: {},
        email: "kandidat@example.com",
        collection,
        query,
        where,
        limit
    });

    assert.equal(queries.length, 2);
    assert.deepEqual(collectionCalls, ["interns_screening", "interns_screening"]);
    assert.equal(whereCalls[0].field, "contact_info.email");
    assert.equal(whereCalls[1].field, "internship.email");
    assert.ok(queryCalls.length >= 2);
});

runTest("pickOnboardingCandidate memilih kandidat accepted/onboarding", () => {
    const rows = [
        { id: "a", data: { recruitment_status: { current: "screening" } } },
        { id: "b", data: { recruitment_status: { current: "accepted" } } }
    ];
    const picked = pickOnboardingCandidate(rows);
    assert.equal(picked.id, "b");
});

runTest("mapInternsScreeningCandidate mengembalikan avatar_url", () => {
    const mapped = mapInternsScreeningCandidate(
        {
            id: "doc1",
            data: {
                basic_info: { full_name: "Nama Lengkap Tiga Kata", avatar_url: "https://cdn/avatar.jpg" },
                contact_info: { email: "kandidat@example.com", whatsapp: "08123" },
                internship: { position: "Marketing" }
            }
        },
        "kandidat@example.com"
    );
    assert.equal(mapped.source, "interns_screening");
    assert.equal(mapped.candidate.avatar_url, "https://cdn/avatar.jpg");
    assert.equal(mapped.candidate.photo, "https://cdn/avatar.jpg");
});

runTest("mapInternsScreeningCandidate melempar error jika avatar_url tidak tersedia", () => {
    assert.throws(
        () =>
            mapInternsScreeningCandidate(
                {
                    id: "doc2",
                    data: {
                        basic_info: { full_name: "Tanpa Avatar" },
                        contact_info: { email: "tanpa-avatar@example.com" },
                        internship: { position: "Sales" }
                    }
                },
                "tanpa-avatar@example.com"
            ),
        /INCOMPLETE_CANDIDATE_AVATAR/
    );
});

console.log("Semua test register-candidate-lookup lulus.");
