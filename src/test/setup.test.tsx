import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import DocumentTable, { getInitialSort } from "../file-browser/DocumentTable";
import { mockFiles, type Folder } from "../file-browser/mockData";

vi.mock("dayjs", () => {
  const dayjs = vi.importActual("dayjs");
  const mockFormat = () => ({ format: () => `formatted-date` });

  return { default: Object.assign(mockFormat, dayjs) };
});

describe("DocumentTable", () => {
  let container: HTMLElement;

  beforeEach(() => {
    const renderResult = render(<DocumentTable />);
    container = renderResult.container;
  });

  const getVisibleNames = () => {
    const rows = container.querySelectorAll("tbody > tr");
    return Array.from(rows)
      .map((row) => (row as HTMLTableRowElement).cells[1]?.textContent || "")
      .filter(Boolean);
  };

  describe("Folder Navigation", () => {
    it("opens a folder and shows only its contents", async () => {
      const user = userEvent.setup();

      const folderToClick = mockFiles.find(
        (f) => f.name === "Expenses",
      ) as Folder;
      const fileInsideFolder = folderToClick.files[0];
      const fileOutsideFolder = mockFiles.find(
        (f) => f.name === "Employee Handbook",
      );

      await user.click(
        screen.getByLabelText(`Open folder ${folderToClick.name}`),
      );

      expect(screen.getByText(fileInsideFolder.name)).toBeInTheDocument();
      expect(
        screen.queryByText(fileOutsideFolder!.name),
      ).not.toBeInTheDocument();
    });

    it("navigates back to parent folder", async () => {
      const user = userEvent.setup();

      // Navigate into a folder first
      const folderToClick = mockFiles.find(
        (f) => f.name === "Expenses",
      ) as Folder;
      await user.click(
        screen.getByLabelText(`Open folder ${folderToClick.name}`),
      );

      // Verify we're in the folder
      expect(screen.getByText(folderToClick.files[0].name)).toBeInTheDocument();

      // Navigate back
      await user.click(screen.getByLabelText("Navigate back to root folder"));

      // Verify we're back to root
      expect(screen.getByText("Employee Handbook")).toBeInTheDocument();
      expect(
        screen.queryByText(folderToClick.files[0].name),
      ).not.toBeInTheDocument();
    });
  });

  describe("Sorting", () => {
    it("cycles through sort states", async () => {
      const user = userEvent.setup();
      const nameSortButton = screen.getByLabelText(/Sort by name/);

      const defaultSortedNames = getInitialSort([...mockFiles]).map(
        (f) => f.name,
      );
      const ascSortedNames = [...mockFiles]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((f) => f.name);
      const descSortedNames = [...ascSortedNames].reverse();

      expect(getVisibleNames()).toEqual(defaultSortedNames);

      await user.click(nameSortButton);
      expect(getVisibleNames()).toEqual(ascSortedNames);

      await user.click(nameSortButton);
      expect(getVisibleNames()).toEqual(descSortedNames);

      await user.click(nameSortButton);
      expect(getVisibleNames()).toEqual(defaultSortedNames);
    });
  });

  describe("Filtering", () => {
    it("filters files by name", async () => {
      const user = userEvent.setup();
      const filterInput = screen.getByLabelText("Filter documents by name");

      await user.type(filterInput, "Employee");

      const visibleNames = getVisibleNames();
      expect(visibleNames).toHaveLength(1);
      expect(visibleNames[0]).toBe("Employee Handbook");
    });

    it("shows no results for non-matching filter", async () => {
      const user = userEvent.setup();
      const filterInput = screen.getByLabelText("Filter documents by name");

      await user.type(filterInput, "nonexistent");

      const visibleNames = getVisibleNames();
      expect(visibleNames).toHaveLength(0);
    });

    it("clears filter when input is cleared", async () => {
      const user = userEvent.setup();
      const filterInput = screen.getByLabelText("Filter documents by name");

      await user.type(filterInput, "Employee");
      expect(getVisibleNames()).toHaveLength(1);

      await user.clear(filterInput);
      expect(getVisibleNames()).toHaveLength(mockFiles.length);
    });

    it("filters correctly when inside a folder", async () => {
      const user = userEvent.setup();
      const filterInput = screen.getByLabelText("Filter documents by name");

      // Navigate into a folder first
      const folderToClick = mockFiles.find(
        (f) => f.name === "Expenses",
      ) as Folder;
      await user.click(
        screen.getByLabelText(`Open folder ${folderToClick.name}`),
      );

      // Now filter within the folder - use a term that matches one of the files
      const fileToFind = folderToClick.files[0];
      const searchTerm = fileToFind.name.split(" ")[0]; // Use first word of filename
      await user.type(filterInput, searchTerm);

      const visibleNames = getVisibleNames();
      expect(visibleNames).toContain(fileToFind.name);
    });
  });

  describe("Integration of Features", () => {
    it("applies both a filter and a sort correctly", async () => {
      const user = userEvent.setup();
      const filterInput = screen.getByLabelText("Filter documents by name");
      const nameSortButton = screen.getByLabelText(/Sort by name/);
      const searchTerm = "e";

      await user.type(filterInput, searchTerm);
      await user.click(nameSortButton);

      const expectedOrder = mockFiles
        .filter((f) => f.name.toLowerCase().includes(searchTerm))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((f) => f.name);

      expect(getVisibleNames()).toEqual(expectedOrder);
    });
  });
});
