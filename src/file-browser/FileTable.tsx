import { useMemo, useRef, useState } from "react";
import {
  mockFiles,
  type FileItem,
  type FileOrFolder,
  type Folder,
} from "./mockData";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  FileStack,
  Folder as FolderIcon,
} from "lucide-react";
import dayjs from "dayjs";

export type SortField = "type" | "name" | "added";
export type SortDirection = "asc" | "desc" | "inactive";

export const getInitialSort = (files: FileOrFolder[]): FileOrFolder[] => {
  return [...files].sort((a, b) => {
    if (a.type === "folder" && b.type !== "folder") return -1;
    if (a.type !== "folder" && b.type === "folder") return 1;
    return a.name.localeCompare(b.name);
  });
};

export default function DocumentTable() {
  const initialSortedFiles = useRef<FileOrFolder[]>(
    [...mockFiles].sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    }),
  );

  const [route, setRoute] = useState<string[]>([]);
  const [currentSort, setCurrentSort] = useState<{
    field: SortField | null;
    direction: SortDirection;
  }>({ field: null, direction: "asc" });

  const [nameFilter, setNameFilter] = useState("");

  const files = useMemo(() => {
    let currentLevel: FileOrFolder[] = initialSortedFiles.current;

    //route logic
    if (route.length > 0) {
      for (const folderName of route) {
        const folder = currentLevel.find(
          (item) => item.type === "folder" && item.name === folderName,
        ) as Folder | undefined;

        if (folder) {
          currentLevel = folder.files;
        }
      }
    }

    //filter logic
    let filteredFiles = currentLevel;
    if (nameFilter) {
      filteredFiles = currentLevel.filter((file) =>
        file.name.toLowerCase().includes(nameFilter.toLowerCase()),
      );
    }

    //sorting logic
    if (currentSort.field && currentSort.direction !== "inactive") {
      return [...filteredFiles].sort((a, b) => {
        const field = currentSort.field!;
        const direction = currentSort.direction;

        const aValue =
          field === "type"
            ? a.type
            : field === "name"
              ? a.name
              : "added" in a
                ? a.added
                : "";
        const bValue =
          field === "type"
            ? b.type
            : field === "name"
              ? b.name
              : "added" in b
                ? b.added
                : "";

        if (aValue < bValue) {
          return direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return getInitialSort(filteredFiles);
  }, [route, nameFilter, currentSort]);

  const navigateToFolder = (folderPath: string[]) => {
    setRoute(folderPath);
    setCurrentSort({ field: null, direction: "inactive" });
    setNameFilter("");
  };

  const handleSort = (field: SortField) => {
    let newDirection: SortDirection = "asc";
    if (currentSort.field === field) {
      if (currentSort.direction === "asc") {
        newDirection = "desc";
      } else if (currentSort.direction === "desc") {
        newDirection = "inactive";
      } else {
        newDirection = "asc";
      }
    }
    setCurrentSort({
      field: newDirection === "inactive" ? null : field,
      direction: newDirection,
    });
  };

  return (
    <div className="min-h-[400px] min-w-[600px] rounded-md border-1 border-sky-600">
      <div className="flex h-12 items-center gap-4 bg-sky-500 px-4 text-white">
        <FileStack /> Documents
      </div>
      <div className="h-2" />
      <div className="p-2">
        <table className="w-full">
          <thead>
            <tr className="h-12 border-b border-sky-600">
              <th className="max-w-10 min-w-10">
                <div className="flex items-center gap-2 pl-4">Type</div>
              </th>
              <th className="">
                <div className="flex items-center gap-2 pl-4">
                  Name
                  <SortButton
                    field="name"
                    direction={
                      currentSort.field === "name"
                        ? currentSort.direction
                        : null
                    }
                    onSort={handleSort}
                  />
                </div>
              </th>
              <th className="">
                <div className="flex items-center gap-2 pl-4">
                  Added
                  <SortButton
                    field="added"
                    direction={
                      currentSort.field === "added"
                        ? currentSort.direction
                        : null
                    }
                    onSort={handleSort}
                  />
                </div>
              </th>
            </tr>
            <tr>
              <th className="max-w-10 min-w-10">
                {route.length > 0 ? (
                  <button
                    onClick={() => navigateToFolder([])}
                    className="text-small flex h-full w-full cursor-pointer items-center gap-2 rounded-none bg-gray-100 px-2 text-gray-500 hover:text-gray-700"
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>
                ) : (
                  <></>
                )}
              </th>
              <th colSpan={2}>
                <div className="flex items-center justify-between px-2 py-1">
                  <input
                    type="search"
                    placeholder="Filter by name..."
                    onChange={(e) => {
                      const filterValue = e.target.value;
                      setNameFilter(filterValue);
                    }}
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {files.map((fileOrFolder) =>
              fileOrFolder.type === "folder" ? (
                <FolderRow
                  key={fileOrFolder.name}
                  folder={fileOrFolder}
                  navigateToFolder={navigateToFolder}
                  route={route}
                />
              ) : (
                <FileRow key={fileOrFolder.name} file={fileOrFolder} />
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortButton({
  field,
  direction,
  onSort,
}: {
  field: SortField;
  direction: SortDirection | null;
  onSort: (field: SortField) => void;
}) {
  const inactiveClass =
    "bg-gray-50 text-gray-400 opacity-50  border-gray-500 hover:border-gray-800 hover:border-2";
  const activeClass = "bg-sky-600 text-white  opacity-100 border-white";
  console;
  return (
    <button
      className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border hover:border ${!direction ? inactiveClass : activeClass}`}
      onClick={() => onSort(field)}
    >
      {!direction ? (
        <ArrowUpDown size={14} />
      ) : direction === "asc" ? (
        <ArrowUp size={16} strokeWidth={4} />
      ) : (
        <ArrowDown size={16} strokeWidth={4} />
      )}
    </button>
  );
}

function FileRow({ file }: { file: FileItem }) {
  return (
    <tr className="h-10">
      <td className="px-4">{file.type}</td>
      <td className="px-4">{file.name}</td>
      <td className="px-4">{dayjs(file.added).format("DD/MM/YYYY")}</td>
    </tr>
  );
}

function FolderRow({
  folder,
  navigateToFolder,
  route,
}: {
  folder: Folder;
  navigateToFolder: (route: string[]) => void;
  route: string[];
}) {
  return (
    <tr
      onClick={() => navigateToFolder([...route, folder.name])}
      className="h-10 cursor-pointer bg-amber-50 hover:bg-amber-100 focus:outline-2 focus:outline-gray-600"
      tabIndex={0}
    >
      <td className="px-4">
        <FolderIcon />
      </td>
      <td className="px-4">{folder.name}</td>
      <td className="px-4"></td>
    </tr>
  );
}
