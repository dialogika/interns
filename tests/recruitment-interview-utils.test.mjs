import assert from "node:assert/strict";
import {
    normalizeInterviewMode,
    isInterviewTimeWithinRange,
    formatInterviewScheduleLabel,
    getInterviewScheduleStatus,
    getInterviewScheduleBadgeMeta,
    formatInterviewerSummary,
    buildInterviewLocationLine,
    formatInterviewScheduleDateTimeLabel,
    filterAndSortInterviewSchedules
} from "../element/recruitment-interview-utils.js";

function runTest(name, fn) {
    try {
        fn();
        console.log("[PASS]", name);
    } catch (error) {
        console.error("[FAIL]", name);
        throw error;
    }
}

runTest("normalizeInterviewMode mengembalikan online jika valid", () => {
    assert.equal(normalizeInterviewMode("online"), "online");
    assert.equal(normalizeInterviewMode("ONLINE"), "online");
});

runTest("normalizeInterviewMode fallback ke offline jika input kosong/tidak valid", () => {
    assert.equal(normalizeInterviewMode(""), "offline");
    assert.equal(normalizeInterviewMode("hybrid"), "offline");
});

runTest("isInterviewTimeWithinRange valid pada rentang 09:00-18:00", () => {
    assert.equal(isInterviewTimeWithinRange("2026-04-28T09:00:00"), true);
    assert.equal(isInterviewTimeWithinRange("2026-04-28T18:00:00"), true);
    assert.equal(isInterviewTimeWithinRange("2026-04-28T08:59:00"), false);
    assert.equal(isInterviewTimeWithinRange("2026-04-28T18:01:00"), false);
});

runTest("formatInterviewScheduleLabel menghasilkan format hari, tanggal, jam WIB", () => {
    const label = formatInterviewScheduleLabel("2026-04-28T10:30:00");
    assert.ok(label.includes("WIB"));
    assert.ok(label.includes(" - "));
});

runTest("getInterviewScheduleStatus mendeteksi today, upcoming, completed", () => {
    const now = "2026-04-28T10:00:00";
    assert.equal(getInterviewScheduleStatus("2026-04-28T18:00:00", now), "today");
    assert.equal(getInterviewScheduleStatus("2026-04-29T09:00:00", now), "upcoming");
    assert.equal(getInterviewScheduleStatus("2026-04-27T09:00:00", now), "completed");
});

runTest("getInterviewScheduleBadgeMeta mengembalikan label dan class yang sesuai", () => {
    assert.deepEqual(getInterviewScheduleBadgeMeta("today"), {
        label: "Today",
        className: "interview-schedule-badge badge-today"
    });
    assert.deepEqual(getInterviewScheduleBadgeMeta("completed"), {
        label: "Completed",
        className: "interview-schedule-badge badge-completed"
    });
    assert.deepEqual(getInterviewScheduleBadgeMeta("upcoming"), {
        label: "Upcoming",
        className: "interview-schedule-badge badge-upcoming"
    });
});

runTest("formatInterviewerSummary merangkum list interviewer >2", () => {
    const summary = formatInterviewerSummary(["A", "B", "C", "D"]);
    assert.equal(summary.shortText, "Interviewer: A, B +2");
    assert.equal(summary.fullText, "A, B, C, D");
});

runTest("buildInterviewLocationLine menyesuaikan mode interview", () => {
    assert.equal(buildInterviewLocationLine("online", "https://meet.example", ""), "Link Meeting : https://meet.example");
    assert.equal(buildInterviewLocationLine("offline", "", "Dialogika HQ"), "Lokasi : Dialogika HQ");
});

runTest("formatInterviewScheduleDateTimeLabel menghasilkan format hari, tanggal, jam WIB", () => {
    const label = formatInterviewScheduleDateTimeLabel("2026-04-30T09:45:00");
    assert.ok(label.includes("WIB"));
    assert.ok(label.includes("09.45"));
});

runTest("filterAndSortInterviewSchedules default nearest + filter nama kandidat/interviewer", () => {
    const entries = [
        {
            candidateName: "Budi",
            interviewerNames: ["Nadia"],
            scheduleAt: "2026-05-01T10:00:00"
        },
        {
            candidateName: "Andi",
            interviewerNames: ["Rina"],
            scheduleAt: "2026-04-30T09:00:00"
        },
        {
            candidateName: "Citra",
            interviewerNames: ["Dwi"],
            scheduleAt: "2026-05-02T11:00:00"
        }
    ];

    const byCandidate = filterAndSortInterviewSchedules(entries, { query: "andi" });
    assert.equal(byCandidate.length, 1);
    assert.equal(byCandidate[0].candidateName, "Andi");

    const byInterviewer = filterAndSortInterviewSchedules(entries, { query: "dwi" });
    assert.equal(byInterviewer.length, 1);
    assert.equal(byInterviewer[0].candidateName, "Citra");

    const nearest = filterAndSortInterviewSchedules(entries, {});
    assert.deepEqual(nearest.map(item => item.candidateName), ["Andi", "Budi", "Citra"]);
});

runTest("filterAndSortInterviewSchedules mendukung filter tanggal dan sorting farthest", () => {
    const entries = [
        {
            candidateName: "Andi",
            interviewerNames: ["Rina"],
            scheduleAt: "2026-04-30T09:00:00"
        },
        {
            candidateName: "Budi",
            interviewerNames: ["Nadia"],
            scheduleAt: "2026-04-30T15:00:00"
        },
        {
            candidateName: "Citra",
            interviewerNames: ["Dwi"],
            scheduleAt: "2026-05-02T11:00:00"
        }
    ];

    const filteredByDate = filterAndSortInterviewSchedules(entries, { date: "2026-04-30" });
    assert.deepEqual(filteredByDate.map(item => item.candidateName), ["Andi", "Budi"]);

    const farthest = filterAndSortInterviewSchedules(entries, { sort: "farthest" });
    assert.deepEqual(farthest.map(item => item.candidateName), ["Citra", "Budi", "Andi"]);
});

console.log("Semua test recruitment-interview-utils lulus.");
