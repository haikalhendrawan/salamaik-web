# Change Log
All notable changes to this project will be documented in this file.
 
## [1.0.1] - 2024-10-31

### Changed
- Add comment module
- Edit worksheet file size limit to 20Mb
- Edit request body parameter on notification controller that caused unreadable notification bug

## [1.0.2] - 2024-12-26

### Changed
- Add changelog
- Add alter unit and alter period middleware
- Add method on worksheet model

### Fixed
- Refactor findings route
- Fix unoptimized query on matrix module
- Fix security flaws that allow unauthorized user to access other unit : matrix with detail, standardization worksheet, worksheet by period and unit

## [1.0.3] - 2024-12-28

### Changed
- Edit tsconfig.json
- Add test


## [1.0.4] - 2025-01-05

### Changed
- add http request response compression


## [1.0.5] - 2025-01-18

### Changed
- optimize ws junction get score progress response load size

## [1.0.6] - 2025-03-02

### Changed
- add alter period payload on standardization route

## [1.0.7] - 2025-03-29

### Changed
- add more detail on every worksheet related activity log
- change activity detail column to jsonb format (DB)
- convert acitivity detail from string to json on controller

### Fixed
- fix activity id on activity controller does not match with activity reference
- update impacted data on database with custom query (set conflicted activity junction with id 88-> 87 and 89 -> 88) (DB)
- update checklist, activity, worksheet type

## [1.0.7b] - 2025-03-31

### Fixed
- fix findings count bug on findings util

 