const flatten = arr =>
  arr.reduce((acc, e) => acc.concat(Array.isArray(e) ? flatten(e) : e), []);

const sum = xs => xs.reduce((acc, x) => acc + x, 0);

const filesInDirectory = dir =>
  new Promise(resolve =>
    dir.createReader().readEntries(async entries => {
      const files = await Promise.all(
        entries
          .filter(e => !e.name.startsWith("."))
          .map(e =>
            e.isDirectory
              ? filesInDirectory(e)
              : new Promise(resolve => e.file(resolve))
          )
      );
      return resolve(flatten(files));
    })
  );

const modifiedTimeForFilesInDirectory = async dir => {
  const files = await filesInDirectory(dir);
  return sum(files.map(f => f.lastModified));
};

const reload = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
    if (activeTab) {
      chrome.tabs.reload(activeTab.id);
    }

    chrome.runtime.reload();
  });
};

const hasDirectoryChanged = async (dir, lastModifiedTime) => {
  if (!lastModifiedTime) return true;

  const modifiedTime = await modifiedTimeForFilesInDirectory(dir);
  return modifiedTime !== lastModifiedTIme;
};

const watchForChanges = async (dir, lastModifiedTime) => {
  const hasChanged = await hasDirectoryChanged(dir, lastModifiedTime);
  if (hasChanged) {
    reload();
  } else {
    setTimeout(() => watchForChanges(dir, lastModifiedTime), 100);
  }
};

chrome.management.getSelf(self => {
  if (self.installType === "development") {
    chrome.runtime.getPackageDirectoryEntry(watchForChanges);
  }
});
