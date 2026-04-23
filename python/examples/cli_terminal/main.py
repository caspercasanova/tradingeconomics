import ClassLibrary as cl

import optparse

parser = optparse.OptionParser(usage='usage: %prog  [options]')
parser.add_option('-k', '--key', type=str, default='', help='request a package of symbols [default: %default]')

(options, args) = parser.parse_args()

session_key=options.key

if session_key == '':
    
    session_key = input('Please insert your API key. To get an API key, visit https://tradingeconomics.com/api/pricing.aspx: ')
    if session_key == '':
        print('No API key provided. You must subscribe to a plan at https://tradingeconomics.com/api/pricing.aspx')
        exit()


session_operator = cl.Operator(session_key)











