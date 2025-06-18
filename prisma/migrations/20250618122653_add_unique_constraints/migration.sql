/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `gallery` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `tour_packages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "gallery_title_key" ON "gallery"("title");

-- CreateIndex
CREATE UNIQUE INDEX "tour_packages_name_key" ON "tour_packages"("name");
