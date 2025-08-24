# UI Overlap Regression Test Case

## Test Information
**Test ID**: BTRADE-REGRESSION-001  
**Test Type**: Regression Test  
**Priority**: High  
**Category**: UI Layout  
**Created**: January 21, 2025  
**Last Updated**: January 21, 2025

## Test Purpose
Prevent regression of UI overlap issues in the Trading Pairs panel, specifically ensuring that search input, category buttons, and trading pairs list maintain proper spacing and do not overlap.

## Background
**Original Issue**: BTRADE-UI-001  
**Issue Description**: Search box and category buttons were overlapping the trading pairs list due to improper flex layout configuration and excessive padding.

**Root Cause**: 
- Excessive padding (`p-4`) causing layout overflow
- Missing `flex-shrink-0` on fixed elements
- Missing `min-h-0` on scrollable container

**Fix Applied**:
- Reduced padding from `p-4` to `p-3`
- Added `flex-shrink-0` to search input and category sections
- Added `min-h-0` to trading pairs list container

## Regression Test Steps

### Pre-Test Setup
1. Ensure development server is running (`npm run dev`)
2. Navigate to `http://localhost:5173/`
3. Focus on the left Trading Pairs panel

### Visual Layout Checks

#### Check 1: Component Separation
**Expected**: Clear visual separation between all components
- [ ] Search input area is distinct and not overlapping
- [ ] Category buttons (All, BTC, ETH, USDT) have proper spacing
- [ ] Trading pairs list starts below category buttons
- [ ] No visual overlaps between any components

#### Check 2: Padding and Margins
**Expected**: Consistent and appropriate spacing
- [ ] Search input has `p-3` padding (not `p-4`)
- [ ] Category buttons have `px-3 py-2` padding
- [ ] Overall panel maintains proper internal spacing
- [ ] No excessive whitespace or cramped layouts

#### Check 3: Flex Layout Behavior
**Expected**: Proper flex container behavior
- [ ] Search input section has `flex-shrink-0` class
- [ ] Category section has `flex-shrink-0` class
- [ ] Trading pairs list has `min-h-0` class
- [ ] List container properly handles overflow with scrolling

### Functional Validation

#### Test 1: Search Input Interaction
- [ ] Click on search input - no layout shift
- [ ] Type in search input - no component overlap
- [ ] Clear search input - layout remains stable

#### Test 2: Category Button Interaction
- [ ] Click each category button - no layout disruption
- [ ] Active state styling works without overlap
- [ ] Category switching maintains proper spacing

#### Test 3: List Scrolling
- [ ] Scroll trading pairs list - fixed elements remain in place
- [ ] Scroll to top/bottom - no content cutoff
- [ ] List scrolling doesn't affect other components

### Code Validation

#### File: `src/components/TradingPairSelector.js`
**Critical Classes to Verify**:

```javascript
// Search input section should have:
className="flex-shrink-0 p-3"

// Category section should have:
className="flex-shrink-0 px-3 py-2"

// Trading pairs list should have:
className="flex-1 overflow-y-auto min-h-0"
```

**Anti-Patterns to Watch For**:
- ❌ `p-4` padding (too much)
- ❌ Missing `flex-shrink-0` on fixed elements
- ❌ Missing `min-h-0` on scrollable containers
- ❌ Absolute positioning without proper constraints

### Browser Compatibility Check
- [ ] Chrome: Layout renders correctly
- [ ] Firefox: Layout renders correctly
- [ ] Safari: Layout renders correctly

### Responsive Layout Check
- [ ] Desktop (1920x1080): No overlaps
- [ ] Laptop (1366x768): No overlaps
- [ ] Tablet (768x1024): Components adapt properly
- [ ] Mobile (375x667): No horizontal overflow

## Automated Test Implementation

### Playwright Test Snippet
```javascript
// Future automated test implementation
test('Trading Pairs Panel - No UI Overlaps', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  // Check search input visibility
  const searchInput = page.locator('input[placeholder="Search pairs..."]');
  await expect(searchInput).toBeVisible();
  
  // Check category buttons visibility
  const categoryButtons = page.locator('.category-button');
  await expect(categoryButtons).toHaveCount(4);
  
  // Check trading pairs list visibility
  const pairsList = page.locator('.trading-pairs-list');
  await expect(pairsList).toBeVisible();
  
  // Verify no overlapping elements
  const searchBox = await searchInput.boundingBox();
  const listBox = await pairsList.boundingBox();
  
  // Ensure search box is above the list (no overlap)
  expect(searchBox.y + searchBox.height).toBeLessThan(listBox.y);
});
```

## Failure Criteria

**CRITICAL FAILURE** (Immediate fix required):
- Any visual overlap between search input and trading pairs list
- Category buttons overlapping with list items
- Search input not accessible or hidden

**MAJOR FAILURE** (Fix within 1 day):
- Inconsistent spacing between components
- Layout shifts during interaction
- Scrolling issues in trading pairs list

**MINOR FAILURE** (Fix within 1 week):
- Slight padding inconsistencies
- Minor responsive layout issues
- Cross-browser styling differences

## Test Execution Schedule

**Frequency**: 
- Before each release
- After any CSS/layout changes
- After dependency updates affecting UI libraries

**Trigger Events**:
- Changes to `TradingPairSelector.js`
- Changes to `AssetListPanel.js`
- Updates to Tailwind CSS configuration
- Changes to main layout components

## Test Data Requirements

**Minimum Test Data**:
- At least 10 trading pairs for scrolling tests
- Multiple categories (BTC, ETH, USDT) with pairs
- Search terms that return both results and no results

## Recovery Procedures

If regression is detected:

1. **Immediate**: Revert to last known good commit
2. **Investigation**: Compare current CSS classes with reference implementation
3. **Fix**: Apply proper flex layout classes as documented
4. **Validation**: Re-run full regression test suite
5. **Documentation**: Update this test case if new scenarios discovered

---

**Test Case Owner**: QA Team  
**Review Cycle**: Monthly  
**Last Execution**: January 21, 2025  
**Next Scheduled**: Before next release