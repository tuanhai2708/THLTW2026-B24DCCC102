/**
 * Infrastructure layer — Persistence adapter.
 *
 * Architecture decision: Wrapping localStorage behind a typed interface
 * so the model layer never touches raw JSON. When migrating to API,
 * only this file changes — zero impact on business logic or UI.
 *
 * All reads/writes go through try-catch. Corrupted storage should not
 * crash the app — the adapter returns empty state instead.
 */
import { STORAGE_NAMESPACE } from './constants';

const readRegistry = (): KhoaHoc.CourseRecord[] => {
	try {
		const raw = localStorage.getItem(STORAGE_NAMESPACE);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		console.error(`[CourseStorage] Corrupted data in "${STORAGE_NAMESPACE}", resetting.`);
		localStorage.removeItem(STORAGE_NAMESPACE);
		return [];
	}
};

const writeRegistry = (courses: KhoaHoc.CourseRecord[]): void => {
	try {
		localStorage.setItem(STORAGE_NAMESPACE, JSON.stringify(courses));
	} catch (err) {
		console.error('[CourseStorage] Write failed — possible quota exceeded.', err);
	}
};

export const CourseStorage = { readRegistry, writeRegistry } as const;
