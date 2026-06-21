def solveNQueens(n):
    results = []
    cols = set()
    diag = set()      # r - c
    anti = set()      # r + c
    placement = []    # column index of the queen in each row

    def backtrack(r):
        if r == n:
            board = []
            for c in placement:
                board.append("." * c + "Q" + "." * (n - c - 1))
            results.append(board)
            return
        for c in range(n):
            if c in cols or (r - c) in diag or (r + c) in anti:
                continue
            cols.add(c)
            diag.add(r - c)
            anti.add(r + c)
            placement.append(c)
            backtrack(r + 1)
            placement.pop()
            cols.remove(c)
            diag.remove(r - c)
            anti.remove(r + c)

    backtrack(0)
    return results
