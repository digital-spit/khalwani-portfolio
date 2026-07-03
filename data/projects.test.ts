import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getAdjacentProjects, getProjectBySlug, projects } from "@/data/projects";

const ROOT = join(__dirname, "..");

describe("getProjectBySlug", () => {
  it("returns the project for a known slug", () => {
    const project = getProjectBySlug("levis-150");
    expect(project).toBeDefined();
    expect(project?.client).toBe("Levi's");
    expect(project?.number).toBe("01");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });
});

describe("getAdjacentProjects", () => {
  it("wraps around at the start: prev of the first project is the last", () => {
    const first = projects[0];
    const last = projects[projects.length - 1];
    const { prev, next } = getAdjacentProjects(first.id);
    expect(prev?.id).toBe(last.id);
    expect(next?.id).toBe(projects[1].id);
  });

  it("wraps around at the end: next of the last project is the first", () => {
    const first = projects[0];
    const last = projects[projects.length - 1];
    const { prev, next } = getAdjacentProjects(last.id);
    expect(prev?.id).toBe(projects[projects.length - 2].id);
    expect(next?.id).toBe(first.id);
  });

  it("returns straightforward neighbours for a middle project", () => {
    const { prev, next } = getAdjacentProjects(projects[5].id);
    expect(prev?.id).toBe(projects[4].id);
    expect(next?.id).toBe(projects[6].id);
  });

  it("returns both undefined for an unknown slug", () => {
    const { prev, next } = getAdjacentProjects("does-not-exist");
    expect(prev).toBeUndefined();
    expect(next).toBeUndefined();
  });
});

describe("projects data invariants", () => {
  it("has 23 projects", () => {
    expect(projects).toHaveLength(23);
  });

  it("has a unique id for every project", () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has a nonempty, URL-safe id for every project (id doubles as the route slug)", () => {
    for (const project of projects) {
      expect(project.id, `project ${project.number} has an empty id`).not.toBe("");
      expect(
        project.id,
        `project id "${project.id}" is not URL-safe`
      ).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("has every image path under /work/", () => {
    for (const project of projects) {
      expect(
        project.image,
        `project "${project.id}" image "${project.image}" does not start with /work/`
      ).toMatch(/^\/work\//);
    }
  });

  it("has every image path resolving to a real file under public/ (same expectation as scripts/check-images.mjs)", () => {
    for (const project of projects) {
      expect(
        existsSync(join(ROOT, "public", project.image)),
        `project "${project.id}" image "${project.image}" does not exist under public/`
      ).toBe(true);
    }
  });
});
