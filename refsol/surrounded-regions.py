def solve(board):
    if not board or not board[0]:
        return
    rows, cols = len(board), len(board[0])

    def mark(r, c):
        stack = [(r, c)]
        while stack:
            i, j = stack.pop()
            if 0 <= i < rows and 0 <= j < cols and board[i][j] == "O":
                board[i][j] = "S"
                stack.extend([(i + 1, j), (i - 1, j), (i, j + 1), (i, j - 1)])

    for r in range(rows):
        mark(r, 0)
        mark(r, cols - 1)
    for c in range(cols):
        mark(0, c)
        mark(rows - 1, c)

    for r in range(rows):
        for c in range(cols):
            if board[r][c] == "O":
                board[r][c] = "X"
            elif board[r][c] == "S":
                board[r][c] = "O"
