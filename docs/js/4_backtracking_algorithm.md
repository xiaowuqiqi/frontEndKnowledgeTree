---
title: 回溯算法
group:
  order: 3
  title: 算法基础
order: 4
---
# 回溯算法

 类似于枚举，通过尝试遍历问题各个可能解的通路，当发现此路不通时，回溯到上一步继续尝试别的通路。它属于蛮力策略。

回溯算法基本结构如下，整个遍历过程有点类似于树的先序遍历。

## 结构

对于结果要求，我们首先要判断是否对于**重复不敏感**和**顺序不敏感**和**重复使用**三个要素。

**重复不敏感**：对于计算结果中出现重复的组合，我们认为它算是一个组合。比如输入 [1,1,1] ，计算相加等于2的组合，程序遍历时可能会添加2个 [1,1] 这样的组合，原因是多计算了一遍，而我们只需要一个。

**顺序不敏感**：对于计算结果中出现不同顺序的组合，我们认为它算是一个组合。如[1,2]和[2,1]认为是一个组合。

**重复使用**：输入的元素可以重复使用得到符合条件的组合，例如输入 [1,1,2] ，计算相加等于4的组合，结果有[1,1,1,1]和[2,2]这样的组合，允许输入的元素重复使用。注意的是当计算结果要求“重复不敏感”或者“顺序不敏感”时基本都不会要求可重复使用。

```js
const fn = (arr) => {
  result = []
  // 注意：有些时候结果要求“重复不敏感”，这时我们需要排序，目的是把相同的元素放在一起，我们在遍历时记录并剔除遍历过的元素，防止结果添加重复的进去。
  arr = Array.from(arr).sort((a, b) => a - b)
  // 注意：可以替换上边一句，用于对于重复元素敏感的。通常来说都会要求重复不敏感
  // arr = Array.from(arr)

  function backtrack(path,index,visit) {
    // 1,外层判断条件，用于判断路径（path）是否符合要求的组合，如果符合则添加到 result
    if (……) return result.push(Array.from(path))
    // 2,循环，用于遍历 arr 的元素，也处理“顺序不敏感”的问题。
    for (let i=……;i<arr.length;i++) {
      // 3,内层判断条件，主要用于处理“重复不敏感”的遍历判断问题。
      if (……) {
        continue
      }
      visit[i] = 1
      path.push(arr[i])
      backtrack(path,i,visit)
      path.pop()
      visit[i] = 0
    }
  }

  backtrack(arr,0,[])
}
```

上边标注 2 中，当结果要求“顺序不敏感”时，可以写入 **let i = index** ，每次遍历时不会从0开始，则可以过滤掉不同顺序的组合。

上边标注 2 中，当结果要求“顺序敏感”时，可以写入 **let i = 0** ，例如全排列，每次遍历时都可以从第一个元素开始添加path。

上边标注 3 中，当结果要求“顺序敏感”且不可“重复使用”时，由于for中的条件写入了 let i = 0 都会从头遍历会有重复元素，则可以写入 **if (visit[i] === 1) continue（这种方式要求输入数组相同元素在一起）**  或者 **if(path.includes(nums[i]))continue（这种方式要求输入数组没有重复元素）** 避免“重复使用”问题。

上边标注 3 中，当结果要求“顺序敏感”且“重复不敏感”时，可以写入 **if (i > 0 && visit[i - 1] !== 1 && nums[i] === nums[i - 1]) continue**避免。

# 案例

## 1含有重复元素集合的组合

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

// 给定一个可能有重复数字的整数数组 candidates 和一个目标数 target ，找出 candidates 中所有可以使数字和为 target 的组合
//。
//
// candidates 中的每个数字在每个组合中只能使用一次，解集不能包含重复的组合。
//
//
//
// 示例 1:
//
//
// 输入: candidates = [10,1,2,7,6,1,5], target = 8,
// 输出:
// [
// [1,1,6],
// [1,2,5],
// [1,7],
// [2,6]
// ]
//
// 示例 2:
//
//1 2 2 2 5
//输入: candidates = [2,5,2,1,2], target = 5,
//输出:
//[
//[1,2,2],
//[5]
//]
//
//
//
// 提示:
//
//
// 1 <= candidates.length <= 100
// 1 <= candidates[i] <= 50
// 1 <= target <= 30
//
//
//
//
// 注意：本题与主站 40 题相同： https://leetcode-cn.com/problems/combination-sum-ii/
// Related Topics 数组 回溯
// 👍 10 👎 0
//leetcode submit region begin(Prohibit modification and deletion)
function combinationSum2(candidates: number[], target: number): number[][] {
    const res = []
    candidates.sort((a, b) => a - b);
    const dfs = (index, path) => {
        const sum = path.reduce((_num, total) => _num + total, 0)
        if (sum === target) {
            res.push([...path]);
            return;
        }
        if (sum > target) {
            return;
        }
        for (let i = index; i < candidates.length; i++) {
            if (i > index && candidates[i - 1] === candidates[i]) {
                continue;
            }
            path.push(candidates[i])
            dfs(i + 1, path)
            path.pop()
        }
    }
    dfs(0, [])
    return res;
};
console.log(combinationSum2([10, 1, 2, 7, 6, 1, 5], 8))
//leetcode submit region end(Prohibit modification and deletion)
    
//// ------------- END -------------
});
```

## 2没有重复元素集合的全排列

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

//给定一个不含重复数字的整数数组 nums ，返回其 所有可能的全排列 。可以 按任意顺序 返回答案。
//
//
//
// 示例 1：
//
//
//输入：nums = [1,2,3]
//输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
//
//
// 示例 2：
//
//
//输入：nums = [0,1]
//输出：[[0,1],[1,0]]
//
//
// 示例 3：
//
//
//输入：nums = [1]
//输出：[[1]]
//
//
//
//
// 提示：
//
//
// 1 <= nums.length <= 6
// -10 <= nums[i] <= 10
// nums 中的所有整数 互不相同
//
//
//
//
// 注意：本题与主站 46 题相同：https://leetcode-cn.com/problems/permutations/
// Related Topics 数组 回溯
// 👍 9 👎 0


//leetcode submit region begin(Prohibit modification and deletion)
function permute(nums: number[]): number[][] {
    const res: number[][] = [];
    const dfs = (path: number[]) => {
        if (path.length === nums.length) {
            return res.push([...path])
        }
        for (let i = 0; i < nums.length; i++) {
            if(path.includes(nums[i])){
                continue;
            }
            path.push(nums[i])
            dfs(path);
            path.pop()
        }
    }
    dfs([])
    return res
};
console.log(permute([1, 2, 3]))
// 或者 
function combinationsSum2(cand) {
  let res = []
  // cand.sort((a, b) => a - b)
  cand = Array.from(cand).sort((a, b) => a - b)

  function dfs(path, visit) {
    if (path.length === cand.length) return res.push(Array.from(path))
    for (let i = 0; i < cand.length; i++) {
      if (visit[i] === 1) {
        continue
      }
      visit[i] = 1
      path.push(cand[i])
      dfs(path, visit)
      path.pop()
      visit[i] = 0
    }
  }

  dfs([],[])
  return res
}
let a = [1,2,3]
console.log(combinationsSum2(a))
    
//// ------------- END -------------
});
```

## 4含有重复元素集合的全排列

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------
    
//给定一个可包含重复数字的整数集合 nums ，按任意顺序 返回它所有不重复的全排列。
//
//
//
// 示例 1：
//
//
//输入：nums = [1,1,2]
//输出：
//[[1,1,2],
// [1,2,1],
// [2,1,1]]
//
//
// 示例 2：
//
//
//输入：nums = [1,2,3]
//输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
//
//
//
//
// 提示：
//
//
// 1 <= nums.length <= 8
// -10 <= nums[i] <= 10
//
//
//
//
// 注意：本题与主站 47 题相同： https://leetcode-cn.com/problems/permutations-ii/
// Related Topics 数组 回溯
// 👍 9 👎 0


// 注意 1，let i = index 表示的是结果对于顺序不重要，需要过滤掉元素相同顺序不同的（如[1,2]和[2,1]认为是一个结果）
// 注意 2，if (visit[i] === 1) continue; 或者 if(path.includes(nums[i]))continue; 都是表明，结果不需要遍历相同元素（如 输入[1,2]不能有[1,1,1]这样的结果）
// 注意 3，if (i > 0 && visit[i - 1] !== 1 && nums[i] === nums[i - 1]) continue; 表明入参的数据有相同元素，需要过滤（如 输入[1,1,2] 不能有两个[1,1]结果）

//leetcode submit region begin(Prohibit modification and deletion)
function permuteUnique(nums: number[]): number[][] {
    const res = []
    nums.sort((a, b) => a - b);
    const dfs = (path: number[], visit: 1 | undefined[]) => {
        if (path.length === nums.length) {
            res.push([...path]);
            return;
        }
        for (let i = 0; i < nums.length; i++) {
            // 已经在层级上记录过了
            if (visit[i] === 1) continue;
            // 上一层没有记录 且 上一个等于这一个的num
            if (i > 0 && visit[i - 1] !== 1 && nums[i] === nums[i - 1]) continue;
            visit[i] = 1
            path.push(nums[i]);
            dfs(path, visit);
            path.pop();
            visit[i] = undefined;
        }
    }
    dfs([], [])
    return res;
};
console.log(permuteUnique([3,3,0,3]))
//leetcode submit region end(Prohibit modification and deletion)
    
//// ------------- END -------------
});
```

## 7生成匹配的括号

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------
    
//正整数 n 代表生成括号的对数，请设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。
//
//
//
// 示例 1：
//
//
//输入：n = 3
//输出：["((()))","(()())","(())()","()(())","()()()"]
//
//
// 示例 2：
//
//
//输入：n = 1
//输出：["()"]
//
//
//
//
// 提示：
//
//
// 1 <= n <= 8
//
//
//
//
// 注意：本题与主站 22 题相同： https://leetcode-cn.com/problems/generate-parentheses/
// Related Topics 字符串 动态规划 回溯
// 👍 14 👎 0


//leetcode submit region begin(Prohibit modification and deletion)
function generateParenthesis(n: number): string[] {
    const res: string[] = []
    const path: string[] = [];
    const dfs = (left, right) => {
        if (left === 0 && right === 0) {
            return res.push(path.join(''))
        }
        if (left > 0) {
            path.push('(')
            dfs(left - 1, right)
            path.pop()
        }
        if (left < right) {
            path.push(')')
            dfs(left, right - 1);
            path.pop()
        }
    }
    dfs(n,n)
    return res
}

console.log(generateParenthesis(3));
// 或者
function fn(n) {
  let baseArr = [
    ...(Array.from(Array(n)).map(() => '(')),
    ...(Array.from(Array(n)).map(() => ')'))
  ];
  let res = []
  const dfs = (path = [], visit = [], stack = []) => {
    if (path.length === baseArr.length && stack.length === 0)
      return res.push(Array.from(path).join(''));
    for (let i = 0; i < baseArr.length; i++) {
      if(baseArr[i] === ')'&&stack.length === 0){
        continue;
      }
      if (i > 0 && visit[i - 1] !== 1 && baseArr[i] === baseArr[i - 1])
        continue;
      if (visit[i] === 1) continue;
      if (baseArr[i] === '(')stack.push('1');else stack.pop()
      visit[i] = 1
      path.push(baseArr[i])
      dfs(path, visit, stack)
      path.pop();
      if (baseArr[i] === '(')stack.pop();else stack.push('1')
      visit[i] = undefined;
    }
  }
  dfs()
  return res
}

console.log(fn(2))
    
//// ------------- END -------------
});
```

## 8数组中和为0的三个数

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------
    
//给定一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a ，b ，c ，使得 a + b + c = 0 ？请找出所有和为 0 且
//不重复 的三元组。
//
//
//
// 示例 1：
//
//
//输入：nums = [-1,0,1,2,-1,-4]
//输出：[[-1,-1,2],[-1,0,1]]
//
//
// 示例 2：
//
//
//输入：nums = []
//输出：[]
//
//
// 示例 3：
//
//
//输入：nums = [0]
//输出：[]
//
//
//
//
// 提示：
//
//
// 0 <= nums.length <= 3000
// -105 <= nums[i] <= 105
//
//
//
//
// 注意：本题与主站 15 题相同：https://leetcode-cn.com/problems/3sum/
// Related Topics 数组 双指针 排序
// 👍 29 👎 0
// 回溯方法
function fn(nums) {
  nums =Array.from(nums).sort((a,b)=>a-b);
  let res = [];
  const dfs = (path = [],index=0,visit=[]) => {
    if(path.length===3&&path.reduce((total,item)=>item+total,0) === 0)
      return res.push(Array.from(path));
    if (path.length===3)return;
    for (let i = index; i < nums.length; i++) {
      if (i > 0 && visit[i - 1] !== 1 && nums[i] === nums[i - 1])
        continue;
      visit[i] = 1
      path.push(nums[i])
      dfs(path,i+1,visit)
      path.pop();
      visit[i] = undefined
    }
  }
  dfs()
  return res
}

console.log(fn([-1,0,1,2,-1,-4]))
/////// 或者
function threeSum(nums: number[]): number[][] {
    const res: number[][] = [];
    nums.sort((a, b) => a - b)
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > 0) break;
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        let left = i + 1
        let right = nums.length - 1;
        while (left < right) {
            let total = nums[i] + nums[left] + nums[right];
            console.log(total === 0,i, left, right)
            if (total === 0) {
                res.push([nums[i], nums[left], nums[right]])
                while (left < right && nums[left] === nums[left + 1]) left++;
                left++;
            } else if (total < 0) {
                left++;
            } else if (total > 0) {
                right--;
            }
        }
    }
    return res;
};
console.log(threeSum([-1, 0, 1, 2, -1, -4]))
//leetcode submit region end(Prohibit modification and deletion)
    
//// ------------- END -------------
});
```

## 9分割回文子字符串

注，这一题在 for 上边 定义了 tempstr 变量，主要用于记录符合回文条件的字符串。

如果按照标准结构没有记录变量，path存储的都是单个元素，而通过 tempstr 累加，可以得到符合条件的累加元素。

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------
    
// 给定一个字符串 s ，请将 s 分割成一些子串，使每个子串都是 回文串 ，返回 s 所有可能的分割方案。
//
// 回文串 是正着读和反着读都一样的字符串。
//
//
//
// 示例 1：
//
//
//输入：s = "google"
//输出：[["g","o","o","g","l","e"],["g","oo","g","l","e"],["goog","l","e"]]
//
//
// 示例 2：
//
//
//输入：s = "aab"
//输出：[["a","a","b"],["aa","b"]]
//
//
// 示例 3：
//
//
//输入：s = "a"
//输出：[["a"]]
//
//
//
// 提示：
//
//
// 1 <= s.length <= 16
// s 仅由小写英文字母组成
//
//
//
//
// 注意：本题与主站 131 题相同： https://leetcode-cn.com/problems/palindrome-partitioning/
// Related Topics 深度优先搜索 广度优先搜索 图 哈希表
// 👍 13 👎 0
//输入：s = "google"
//输出：[["g","o","o","g","l","e"],["g","oo","g","l","e"],["goog","l","e"]]
function partition(s: string): string[][] {
    const res: string[][] = [];
    const path: string[] = [];
    const dfs = (index: number) => {
        if (index === s.length) {
            return res.push([...path]);
        }
        let tempStr = '';
        for (let i = index; i < s.length; i++) {
            tempStr += s[i]
            if(tempStr !== [...tempStr.split('')].reverse().join(''))continue;
            path.push(tempStr);
            dfs(i + 1)
            path.pop()
        }
    }
    dfs(0)
    return res
};
console.log(partition('google'));
    
//// ------------- END -------------
});
```

## 10复原 IP

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------
 
//给定一个只包含数字的字符串 s ，用以表示一个 IP 地址，返回所有可能从 s 获得的 有效 IP 地址 。你可以按任何顺序返回答案。
//
// 有效 IP 地址 正好由四个整数（每个整数位于 0 到 255 之间组成，且不能含有前导 0），整数之间用 '.' 分隔。
//
// 例如："0.1.2.201" 和 "192.168.1.1" 是 有效 IP 地址，但是 "0.011.255.245"、"192.168.1.312"
//和 "192.168@1.1" 是 无效 IP 地址。
//
//
//
// 示例 1：
//
//
//输入：s = "25525511135"
//输出：["255.255.11.135","255.255.111.35"]
//
//
// 示例 2：
//
//
//输入：s = "0000"
//输出：["0.0.0.0"]
//
//
// 示例 3：
//
//
//输入：s = "1111"
//输出：["1.1.1.1"]
//
//
// 示例 4：
//
//
//输入：s = "010010"
//输出：["0.10.0.10","0.100.1.0"]
//
//
// 示例 5：
//
//
//输入：s = "10203040"
//输出：["10.20.30.40","102.0.30.40","10.203.0.40"]
//
//
//
//
// 提示：
//
//
// 0 <= s.length <= 3000
// s 仅由数字组成
//
//
//
//
// 注意：本题与主站 93 题相同：https://leetcode-cn.com/problems/restore-ip-addresses/
// Related Topics 字符串 回溯
// 👍 15 👎 0


function fn(s) {
  let res = [];
  const dfs = (path = [], index = 0) => {
    if (index === s.length && path.length === 4) {
      return res.push(Array.from(path).join('.'));
    }
    let str = ''
    for (let i = index; i < s.length; i++) {
      str = str + s[i];
      if (str[0] === '0' && str !== '0')
        continue;
      if (Number.parseInt(str) > 255)
        continue;
      if (path.length === 4) return;
      path.push(str);
      dfs(path, i + 1);
      path.pop();
    }
  }
  dfs()
  return res
}

console.log(fn("25525511135"))
console.log(fn("010010"))

//// ------------- END -------------
});
```
